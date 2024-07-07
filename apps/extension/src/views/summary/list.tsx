import { api } from "~lib/trpc/react";
import { ListSkeleton } from "./skeleton";
import { NoSummaries } from "./no-summaries";
import { Card, Container, Stack, Typography } from "@mui/material";
import { Header } from "~components/header";

export const SummaryList = () => {
	const { data, isLoading } = api.summary.getLatest.useQuery({
		limit: 10,
	});

	return (
		<>
			<Header title="Your Summaries" />
			{isLoading && <ListSkeleton />}
			{data?.length === 0 ? (
				<NoSummaries />
			) : (
				<Container sx={{ display: "flex", flexDirection: "column" }}>
					<Typography variant="h2" sx={{ mb: 2, fontWeight: 600 }}>
						Your Summaries
					</Typography>
					<Stack>
						{data?.map((summary) => (
							<Card elevation={4} key={`card-${window.crypto.randomUUID()}`}>
								{summary.name}
							</Card>
						))}
					</Stack>
				</Container>
			)}
		</>
	);
};
