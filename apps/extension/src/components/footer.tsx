import { Box, Button } from "@mui/material";
import { useAuth } from "@clerk/chrome-extension";

export const Footer = () => {
	const { signOut } = useAuth();
	return (
		<Box
			sx={{
				position: "absolute",
				bottom: 0,
				width: "100%",
				zIndex: 2,
				background: (theme) => theme.palette.background.paper,
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: 1,
			}}
		>
			<Button variant="text" color="primary" onClick={() => signOut()}>
				Sign Out
			</Button>
		</Box>
	);
};
