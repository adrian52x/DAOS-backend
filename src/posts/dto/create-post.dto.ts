export class CreatePostDto {
	readonly title: string;
	readonly postType: 'isPlaying' | 'isLooking';
	readonly instrument: string;
	readonly description: string;
	readonly area: string;
	readonly groupName: string;
	readonly websiteLink?: string;
	readonly userId: string;
}
