import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectList } from './screens/ProjectList';
import { CreateProject } from './screens/CreateProject';
import { AddContext } from './screens/AddContext';
import { GoalDefinition } from './screens/GoalDefinition';
import { InterviewSetup } from './screens/InterviewSetup';
import { InterviewInProgress } from './screens/InterviewInProgress';
import { Outputs } from './screens/Outputs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/new" element={<CreateProject />} />
        <Route path="/projects/:id/context" element={<AddContext />} />
        <Route path="/projects/:id/goals" element={<GoalDefinition />} />
        <Route path="/projects/:id/setup" element={<InterviewSetup />} />
        <Route path="/projects/:id/live" element={<InterviewInProgress />} />
        <Route path="/projects/:id/outputs" element={<Outputs />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
