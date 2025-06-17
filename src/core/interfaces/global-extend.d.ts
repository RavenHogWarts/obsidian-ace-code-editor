export {};

declare global {
	interface Window {
		queryLocalFonts: () => Promise<FontData[]>;
	}
}

interface FontData {
	family: string;
	fullName: string;
	postscriptName: string;
	style: string;
	blob(): Promise<Blob>;
}
