import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, AppBar, Toolbar, Typography } from "@mui/material";
import { AdminPage } from "./components/admin/AdminPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Test from "./pages/nftFeature";
import NftFeature from "./pages/nftFeature";

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
                Admin
              </Link>
              <Link
                to="/nftFeature"
                style={{ color: "white", textDecoration: "none" }}
              >
                NFT Feature
              </Link>
            </Box>

            <Box>
              <ConnectButton />
            </Box>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/nftFeature" element={<NftFeature />} />
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
                  <AdminPage />
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
