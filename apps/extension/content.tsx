import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp
} from "@clerk/chrome-extension"
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom"

function SummaraizeExtension() {
  const navigate = useNavigate()
  return (
    <ClerkProvider
      publishableKey={process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}>
      <Routes>
        <Route path="/sign-up/*" element={<SignUp signInUrl="/" />} />
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <div>
                  <h1>Summaraize</h1>
                  <p>
                    Summarize any video and chat with your favourite content
                  </p>
                </div>
              </SignedIn>
              <SignedOut>
                <SignIn signUpUrl="/sign-up" />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </ClerkProvider>
  )
}

export default function App() {
  return (
    <MemoryRouter>
      <SummaraizeExtension />
    </MemoryRouter>
  )
}
