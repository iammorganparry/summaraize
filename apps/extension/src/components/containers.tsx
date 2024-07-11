import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { routeVariants } from "~utils";

const Container = styled(Box)(({ theme }) => ({
  p: theme.spacing(2),
  height: "calc(100vh - 64px)",
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

export const RouteContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnimatePresence>
      <Container>
        <motion.div variants={routeVariants} initial="initial" animate="final">
          {children}
        </motion.div>
      </Container>
    </AnimatePresence>
  );
};
