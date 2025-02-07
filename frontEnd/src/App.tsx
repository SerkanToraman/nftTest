import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Test from "./pages/test";

function App() {
  return (
    <Router>
      <>
        <Flex
          position="sticky"
          px="4"
          py="2"
          justify="between"
          style={{
            borderBottom: "1px solid var(--gray-a2)",
          }}
        >
          <Box>
            <Heading>dApp Starter Template</Heading>
            <Link to="/" style={{ marginRight: "1rem" }}>
              Home
            </Link>
            <Link to="/test">Test</Link>
          </Box>

          <Box>
            <ConnectButton />
          </Box>
        </Flex>

        <Routes>
          <Route path="/test" element={<Test />} />
          <Route
            path="/"
            element={
              <Container>
                <Container
                  mt="5"
                  pt="2"
                  px="4"
                  style={{ background: "var(--gray-a2)", minHeight: 500 }}
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
