import Skeleton from "@mui/material/Skeleton";
import { Container, Grid, Stack } from "@mui/material";

const createRandomWidth = () => {
	return Math.floor(Math.random() * 150) + 50;
};

const SkeletonCard = () => {
	return (
		<Grid container spacing={1} alignItems="center" columnGap={1} p={1}>
			<Grid item xs={4}>
				<Skeleton height={200} />
			</Grid>
			<Grid item xs={7} alignItems="center">
				<Skeleton height={30} width={300} />
				<Skeleton height={30} width={225} />
				{Array.from({ length: 3 }, () => (
					<Skeleton
						key={`skeleton-${window.crypto.randomUUID()}`}
						height={20}
						width={createRandomWidth()}
					/>
				))}
			</Grid>
		</Grid>
	);
};

export const ListSkeleton = () => {
	return (
		<Container>
			<Stack gap={0}>
				{Array.from({ length: 10 }, () => (
					<SkeletonCard key={`skeleton-card-${window.crypto.randomUUID()}`} />
				))}
			</Stack>
		</Container>
	);
};
