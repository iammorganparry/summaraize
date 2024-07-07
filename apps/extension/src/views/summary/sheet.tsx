import { SignedIn, SignedOut } from "@clerk/chrome-extension";
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";

import { Selectors, Sizes } from "./constants";
import { LoginPage } from "~views/login/login";
import { Footer } from "~components/footer";
import { Route, Routes } from "react-router-dom";
import { SummaryList } from "./list";
import { RouteContainer } from "~components/containers";
import { Header } from "~components/header";

export function SummaraizeSheet({
	shadowHost,
}: {
	shadowHost: Element | null;
}) {
	const [state, setState] = useState({
		open: false,
	});
	const container = shadowHost?.shadowRoot?.querySelector(
		Selectors.SHADOW_CONTAINER,
	);

	const handleClose = () => {
		setState({ open: false });
	};

	return (
		<>
			<Button
				onClick={() => setState({ open: true })}
				variant="contained"
				color="primary"
				sx={{
					position: "fixed",
					top: "1rem",
					zIndex: 1300,
					width: "30px",
					minWidth: "unset",
					height: "100px",
					right: state.open ? Sizes.SLIDER_WIDTH : 0,
					transition: "right 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
				}}
			>
				🧙‍♂️
			</Button>
			<Drawer
				container={container}
				anchor="right"
				open={state.open}
				onClose={handleClose}
			>
				<SignedIn>
					<RouteContainer>
						<Routes>
							<Route path="/" element={<SummaryList />} />
							<Route path="/chat" element={<>Chat</>} />
							<Route path="/search" element={<>Search</>} />
						</Routes>
					</RouteContainer>
					<Footer />
				</SignedIn>
				<SignedOut>
					<LoginPage />
				</SignedOut>
			</Drawer>
		</>
	);
}
