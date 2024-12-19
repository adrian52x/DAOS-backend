export const enum ErrorMessages {
	INVALID_CREDS = 'Invalid credentials',
	INVALID_USER_ID = 'Invalid user ID',
	EMAIL_EXISTS = 'Email already exists',
	USER_NOT_FOUND = 'User not found',
	UNKNOW_REGISTER_ERROR = 'An error occurred during registration',

	POST_NOT_FOUND = 'Post not found',
	INVALID_POST_ID = 'Invalid post ID',
	NO_PERMISSION_UPDATE_POST = 'You do not have permission to update this post',
	NO_PERMISSION_CREATE_POST = 'You do not have permission to create a post in this ensemble',
	NO_PERMISSION_DELETE_POST = 'You do not have permission to delete this post',


	ENSEMBLE_NOT_FOUND = 'Ensemble not found',
	ENSEMBLE_EXISTS = 'Ensemble with this name already exists',
	INVALID_ENSEMBLE_ID = 'Invalid ensemble ID',

	ALREADY_MEMBER_OR_PENDING = 'You are already a member or have a pending request',
	ONLY_OWNER_CAN_HANDLE_REQUESTS = 'Only the owner can handle join requests',
	NO_PENDING_REQUEST = 'No pending request from this user',

	INSTRUMENT_ALREADY_EXISTS = 'Instrument with this name already exists: ',
	INSTRUMENT_DOES_NOT_EXIST = 'Instrument not found for deletion',
}
