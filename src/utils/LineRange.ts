/**
 * 行范围解析工具
 * 支持解析类似GitHub的行范围语法：#L10, #L10-L20
 */

export interface LineRange {
	startLine: number;
	endLine: number;
}

/**
 * 解析行范围字符串
 * @param rangeStr 行范围字符串，如 "L10", "L10-L20"
 * @returns LineRange 对象或 null
 */
export function parseLineRange(rangeStr: string): LineRange | null {
	if (!rangeStr) return null;

	// 移除开头的 # 符号
	const cleanStr = rangeStr.replace(/^#/, "");

	// 匹配单行：L10
	const singleLineMatch = cleanStr.match(/^L(\d+)$/i);
	if (singleLineMatch) {
		const lineNumber = parseInt(singleLineMatch[1], 10);
		return {
			startLine: lineNumber,
			endLine: lineNumber,
		};
	}

	// 匹配行范围：L10-L20
	const rangeMatch = cleanStr.match(/^L(\d+)-L(\d+)$/i);
	if (rangeMatch) {
		const startLine = parseInt(rangeMatch[1], 10);
		const endLine = parseInt(rangeMatch[2], 10);

		// 确保起始行不大于结束行
		if (startLine <= endLine) {
			return {
				startLine,
				endLine,
			};
		}
	}

	return null;
}

/**
 * 从文本内容中提取指定行范围
 * @param content 文件完整内容
 * @param range 行范围
 * @returns 指定行范围的内容
 */
export function extractLineRange(content: string, range: LineRange): string {
	const lines = content.split("\n");
	const startIndex = Math.max(0, range.startLine - 1); // 转换为0基索引
	const endIndex = Math.min(lines.length, range.endLine); // 结束索引（不包含）

	return lines.slice(startIndex, endIndex).join("\n");
}

/**
 * 解析双链中的文件路径和行范围
 * @param linktext 链接文本，如 "file.js#L10-L20"
 * @returns 解析结果
 */
export function parseLinkWithRange(linktext: string): {
	filePath: string;
	range: LineRange | null;
} {
	// 查找 # 符号的位置
	const hashIndex = linktext.indexOf("#");

	if (hashIndex === -1) {
		// 没有行范围信息
		return {
			filePath: linktext,
			range: null,
		};
	}

	const filePath = linktext.substring(0, hashIndex);
	const rangeStr = linktext.substring(hashIndex);
	const range = parseLineRange(rangeStr);

	return {
		filePath,
		range,
	};
}
