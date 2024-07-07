import { Box, Typography } from "@mui/material";
import { UserProfile } from "./user-profile";

export const Header = ({ title }: { title: string }) => {
	return (
		<Box
			sx={{
				p: 2,
				gap: 2,
				width: "100%",
				justifyContent: "center",
				flexDirection: "column",
				display: "flex",
				backgroundColor: (theme) => theme.palette.background.paper,
			}}
		>
			<UserProfile />
			<Typography
				variant="h3"
				sx={{
					fontWeight: 600,
				}}
			>
				{title}
			</Typography>
		</Box>
	);
};
