import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { routeVariants } from "~utils";

const Container = styled(Box)(({ theme }) => ({
  p: theme.spacing(2),
  height: "100vh",
  overflowY: "auto",
  display: "flex",
  width: 500,
  overflowX: "hidden",
  backgroundColor: theme.palette.background.default,
  flexDirection: "column",
  position: "relative",
  "& > *": {
    marginBottom: theme.spacing(2),
  },
  "& a": {
    color: theme.palette.info.main,
  },
}));

export const RouteContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnimatePresence>
      <Container>
        <motion.div variants={routeVariants} initial="initial" animate="final" style={{ height: "100%" }}>
          {children}
        </motion.div>
      </Container>
    </AnimatePresence>
  );
};
