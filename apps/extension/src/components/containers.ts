import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export const RouteContainer = styled(Box)(({ theme }) => ({
	p: theme.spacing(2),
	maxHeight: "calc(100vh - 64px)",
	overflowY: "auto",
	display: "flex",
	width: 500,
	overflowX: "hidden",
	backgroundColor: theme.palette.background.default,
	flexDirection: "column",
	"& > *": {
		marginBottom: theme.spacing(2),
	},
}));
