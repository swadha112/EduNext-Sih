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
import Trends from './pages/Tables.jsx';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import Counselors from './pages/Counselors.jsx';
import Chatbot from './pages/Chatbot.jsx';
import Quiz from './pages/Quiz.jsx';
import Alumni from './pages/Alumni.jsx'
import Video from './pages/Video.jsx';
import Workshop from './pages/Workshops.jsx';
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
            <PageTitle title="Signup" />
            <SignUp />
          </>
        }
      />
      <Route
        path="/auth/signin"
        element={
          <>
            <PageTitle title="Signup" />
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
                    <PageTitle title="eCommerce Dashboard" />
                    <ECommerce />
                  </>
                }
              />
              <Route
                path="/calendar"
                element={
                  <>
                    <PageTitle title="Role Playing Game" />
                    <Calendar />
                  </>
                }
              />
              <Route
                path="/calendar"
                element={
                  <>
                    <PageTitle title="Role Playing Game" />
                    <Calendar />
                  </>
                }
              />
              <Route
                path="/calendar"
                element={
                  <>
                    <PageTitle title="Role Playing Game" />
                    <Calendar />
                  </>
                }
              />
              <Route
                path="/career-selection"
                element={
                  <>
                    <PageTitle title="Role Playing Game" />
                    <Calendar />
                  </>
                }
              />
              <Route
                path="/profile"
                element={
                  <>
                    <PageTitle title="Profile" />
                    <Profile />
                  </>
                }
              />
              <Route
                path="/forms/form-elements"
                element={
                  <>
                    <PageTitle title="Form Elements" />
                    <FormElements />
                  </>
                }
              />
              <Route
                path="/forms/form-layout"
                element={
                  <>
                    <PageTitle title="Form Layout" />
                    <FormLayout />
                  </>
                }
              />
              <Route
                path="/tables"
                element={
                  <>
                    <PageTitle title="Tables" />
                    <Trends />
                  </>
                }
              />
              <Route
                path="/counsellors"
                element={
                  <>
                    <PageTitle title="Tables" />
                    <Counselors />
                  </>
                }
              />
              <Route
                path="/alumni"
                element={
                  <>
                    <PageTitle title="Tables" />
                    <Alumni />
                  </>
                }
              />
              <Route
                path="/chatbot"
                element={
                  <>
                    <PageTitle title="Tables" />
                    <Chatbot />
                  </>
                }
              />
              <Route
                path="/workshop"
                element={
                  <>
                    <PageTitle title="Tables" />
                    <Workshop />
                  </>
                }
              />
              <Route
                path="/quiz"
                element={
                  <>
                    <PageTitle title="Tables" />
                    <Quiz />
                  </>
                }
              />
              <Route
                path="/video"
                element={
                  <>
                    <PageTitle title="Tables" />
                    <Video/>
                  </>
                }
              />
              <Route
                path="/video"
                element={
                  <>
                    <PageTitle title="Tables" />
                    <Video/>
                  </>
                }
              />
              <Route
                path="/update"
                element={
                  <>
                    <PageTitle title="Settings" />
                    <Settings />
                  </>
                }
              />
              <Route
                path="/chart"
                element={
                  <>
                    <PageTitle title="Basic Chart" />
                    <Chart />
                  </>
                }
              />
              <Route
                path="/ui/alerts"
                element={
                  <>
                    <PageTitle title="Alerts" />
                    <Alerts />
                  </>
                }
              />
              <Route
                path="/ui/buttons"
                element={
                  <>
                    <PageTitle title="Buttons" />
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
