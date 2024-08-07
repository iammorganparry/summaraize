import { Button, Card, styled, type ButtonProps, Tooltip } from "@mui/material";
import { Home01, List, MessageCircle01, Settings01 } from "@untitled-ui/icons-react";
import { Link, useLocation } from "react-router-dom";
import { Sizes } from "~views/summary/constants";

type NavButtonProps = ButtonProps & {
  isActive?: boolean;
};

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<NavButtonProps>(({ theme, isActive }) => ({
  width: "100%",
  boxShadow: theme.shadows[0],
  border: "none",
  color: theme.palette.common.white,
  backgroundColor: isActive ? theme.palette.primary.main : "transparent",
  "&:hover": {
    boxShadow: theme.shadows[0],
    backgroundColor: theme.palette.primary.main,
  },
}));

const isActive = (path: string | string[], location: string) => {
  if (Array.isArray(path)) {
    return path.includes(location);
  }
  return path === location;
};

export const FooterNav = () => {
  const location = useLocation();
  return (
    <Card
      sx={{
        maxWidth: Sizes.SLIDER_WIDTH,
        boxShadow: (theme) => theme.shadows[1],
        bottom: 30,
        width: 400,
        position: "absolute",
        zIndex: 1300,
        // center
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        background: (theme) => theme.palette.background.paper,
      }}
    >
      <Tooltip title="Settings" placement="top">
        <Link to="/" style={{ width: "100%" }}>
          <NavButton isActive={isActive(["/", "/summary"], location.pathname)}>
            <Home01 />
          </NavButton>
        </Link>
      </Tooltip>
      <Tooltip title="Settings" placement="top">
        <Link to="/chat" style={{ width: "100%" }}>
          <NavButton isActive={isActive("/chat", location.pathname)}>
            <MessageCircle01 />
          </NavButton>
        </Link>
      </Tooltip>
      <Tooltip title="Requests" placement="top">
        <Link to="/requests" style={{ width: "100%" }}>
          <NavButton isActive={isActive("/requests", location.pathname)}>
            <List />
          </NavButton>
        </Link>
      </Tooltip>
    </Card>
  );
};
