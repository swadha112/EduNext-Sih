import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader/index.jsx';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce.jsx';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables.jsx';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import Counselors from './pages/Counselors.jsx';
import Chatbot from './pages/Chatbot.jsx';
import Quiz from './pages/Quiz.jsx';
import Alumni from './pages/Alumni.jsx'
import Video from './pages/Video.jsx';
function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      {/* Route for SignUp (Full Page) */}
      <Route
        path="/auth/signup"
        element={
          <>
            <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <SignUp />
          </>
        }
      />
      <Route
        path="/auth/signin"
        element={
          <>
            <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <SignIn />
          </>
        }
      />
      {/* DefaultLayout routes */}
      <Route
        path="*"
        element={
          <DefaultLayout>
            <Routes>
              <Route
                index
                element={
                  <>
                    <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                    <ECommerce />
                  </>
                }
              />
              <Route
                path="/calendar"
                element={
                  <>
                    <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                    <Calendar />
                  </>
                }
              />
              <Route
                path="/profile"
                element={
                  <>
                    <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                    <Profile />
                  </>
                }
              />
              <Route
                path="/forms/form-elements"
                element={
                  <>
                    <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                    <FormElements />
                  </>
                }
              />
              <Route
                path="/forms/form-layout"
                element={
                  <>
                    <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                    <FormLayout />
                  </>
                }
              />
              <Route
                path="/tables"
                element={
                  <>
                    <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                    <Tables />
                  </>
                }
              />
              <Route
                path="/counsellors"
                element={
                  <>
                    <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                    <Counselors />
                  </>
                }
              />
              <Route
                path="/alumni"
                element={
                  <>
                    <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                    <Alumni />
                  </>
                }
              />
              <Route
                path="/chatbot"
                element={
                  <>
                    <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                    <Chatbot />
                  </>
                }
              />
              <Route
                path="/quiz"
                element={
                  <>
                    <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                    <Quiz />
                  </>
                }
              />
              <Route
                path="/video"
                element={
                  <>
                    <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                    <Video/>
                  </>
                }
              />
              <Route
                path="/settings"
                element={
                  <>
                    <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                    <Settings />
                  </>
                }
              />
              <Route
                path="/chart"
                element={
                  <>
                    <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                    <Chart />
                  </>
                }
              />
              <Route
                path="/ui/alerts"
                element={
                  <>
                    <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                    <Alerts />
                  </>
                }
              />
              <Route
                path="/ui/buttons"
                element={
                  <>
                    <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                    <Buttons />
                  </>
                }
              />
            </Routes>
          </DefaultLayout>
        }
      />
    </Routes>
  );
}

export default App;
