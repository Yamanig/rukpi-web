import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Pay from "./pages/Pay";
import Score from "./pages/Score";
import Merchants from "./pages/Merchants";
import Company from "./pages/Company";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import Security from "./pages/Security";
import Technology from "./pages/Technology";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products/pay" element={<Pay />} />
        <Route path="products/score" element={<Score />} />
        <Route path="merchants" element={<Merchants />} />
        <Route path="company" element={<Company />} />
        <Route path="contact" element={<Contact />} />
        <Route path="legal" element={<Legal />} />
        <Route path="security" element={<Security />} />
        <Route path="technology" element={<Technology />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
