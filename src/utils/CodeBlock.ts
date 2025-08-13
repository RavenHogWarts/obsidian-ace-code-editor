import { getLanguageMode } from "@/src/service/AceLanguages";
import { ICodeBlock } from "@/src/type/types";
import { App, Editor, EditorPosition, MarkdownView } from "obsidian";

export async function getCodeBlockAtCursor(
	editor: Editor,
	cursor: EditorPosition
): Promise<ICodeBlock | null> {
	const line = cursor.line;
	const content = editor.getValue();
	const lines = content.split("\n");

	// 向上查找代码块开始
	let startLine = line;
	while (startLine >= 0) {
		const currentLine = lines[startLine].trim(); // 移除前导空格
		const withoutQuote = currentLine.replace(/^>\s*/, ""); // 移除引用标记
		if (withoutQuote.startsWith("```")) {
			break;
		}
		startLine--;
	}

	// 如果没找到开始标记，返回 null
	if (startLine < 0) return null;

	// 向下查找代码块结束
	let endLine = line;
	while (endLine < lines.length) {
		const currentLine = lines[endLine].trim();
		const withoutQuote = currentLine.replace(/^>\s*/, "");
		if (endLine > startLine && withoutQuote.startsWith("```")) {
			break;
		}
		endLine++;
	}

	// 如果找到完整的代码块
	if (startLine >= 0 && endLine < lines.length) {
		// 获取代码块的起始行，并处理引用和缩进
		const startLineContent = lines[startLine].trim().replace(/^>\s*/, "");
		const blockLanguage = startLineContent.slice(3).trim();
		const resolvedLanguage = await getLanguageMode(blockLanguage);

		// 提取代码内容
		const codeLines = lines.slice(startLine + 1, endLine).map((line) => {
			// 移除引用标记和保持相对缩进
			return line.replace(/^>\s*/, "");
		});

		// 计算最小缩进量
		const minIndent =
			codeLines
				.filter((line) => line.trim().length > 0)
				.reduce((min, line) => {
					const indent = line.match(/^\s*/)?.[0].length || 0;
					return Math.min(min, indent);
				}, Infinity) || 0;

		// 移除共同的缩进，但保留相对缩进
		const code = codeLines
			.map((line) => {
				if (line.trim().length === 0) return line.trim();
				return line.slice(minIndent);
			})
			.join("\n");

		// 获取原始行的缩进和引用标记
		const originalIndent = lines[startLine].match(/^\s*/)?.[0].length || 0;
		const context = getCodeBlockContext(lines, startLine);

		return {
			language: resolvedLanguage,
			code,
			range: {
				start: startLine,
				end: endLine,
			},
			context,
			indent: originalIndent,
		};
	}

	return null;
}

// 获取代码块的上下文信息（例如是否在 callout 中）
function getCodeBlockContext(
	lines: string[],
	startLine: number
): {
	isInCallout: boolean;
	calloutType?: string;
	calloutStartLine?: number;
} {
	let currentLine = startLine;
	let isInCallout = false;
	let calloutType: string | undefined;
	let calloutStartLine: number | undefined;

	// 向上查找 callout 标记
	while (currentLine >= 0) {
		const line = lines[currentLine].trim();
		const calloutMatch = line.match(/^>\s*\[!(\w+)\]/);

		if (calloutMatch) {
			isInCallout = true;
			calloutType = calloutMatch[1];
			calloutStartLine = currentLine;
			break;
		}

		// 如果遇到非引用行，且不是空行，则中断搜索
		if (!line.startsWith(">") && line.length > 0) {
			break;
		}

		currentLine--;
	}

	return {
		isInCallout,
		calloutType,
		calloutStartLine,
	};
}

export async function updateCodeBlock(
	app: App,
	range: { start: number; end: number },
	newCode: string,
	indent: number = 0
): Promise<void> {
	const activeView = app.workspace.getActiveViewOfType(MarkdownView);
	if (!activeView) return;

	const file = activeView.file;
	if (!file) return;

	// 将所有数据处理逻辑包装在process回调函数内部
	await app.vault.process(file, (data) => {
		const lines = data.split("\n");
		const originalStartLine = lines[range.start];
		const originalEndLine = lines[range.end];

		// 提取原始缩进和引用格式
		const indentMatch = originalStartLine.match(/^(\s*)/);
		const originalIndent = indentMatch ? indentMatch[1] : "";
		const isInQuote = originalStartLine.trimStart().startsWith(">");
		const quoteMatch = isInQuote
			? originalStartLine.match(/^[\s>]+\s*/)
			: null;
		const quotePrefix = quoteMatch ? quoteMatch[0] : originalIndent;

		// 保持原有的缩进和引用格式
		const newLines = newCode.split("\n").map((line) => {
			return line.length > 0 ? quotePrefix + line : line;
		});

		// 构建新内容
		const newContent = [
			...lines.slice(0, range.start),
			originalStartLine, // 保持原有的开始行
			...newLines,
			originalEndLine, // 保持原有的结束行
			...lines.slice(range.end + 1),
		].join("\n");

		return newContent;
	});
}
