export default () => ({
	database: {
		mongo: {
			uri: process.env.MONGO_URI,
		},
	},
});
