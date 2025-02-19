import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, AppBar, Toolbar, Typography } from "@mui/material";
import { WalletStatus } from "./WalletStatus";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Test from "./pages/test";

function App() {
  return (
    <Router>
      <>
        <AppBar position="sticky">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6">dApp Starter Template</Typography>
              <Link
                to="/"
                style={{
                  marginRight: "1rem",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                Home
              </Link>
              <Link
                to="/test"
                style={{ color: "white", textDecoration: "none" }}
              >
                Test
              </Link>
            </Box>

            <Box>
              <ConnectButton />
            </Box>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/test" element={<Test />} />
          <Route
            path="/"
            element={
              <Container>
                <Container
                  sx={{
                    mt: 5,
                    pt: 2,
                    px: 4,
                    bgcolor: "grey.800",
                    minHeight: 500,
                  }}
                >
                  <WalletStatus />
                </Container>
              </Container>
            }
          />
        </Routes>
      </>
    </Router>
  );
}

export default App;
