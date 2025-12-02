import { QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import { queryClient } from './lib/queryClient';
import { CreateEvent } from './pages/CreateEvent/CreateEvent';
import { ToastContainer } from './components/organisms/ToastContainer/ToastContainer';
import './styles/globals.css';

function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <CreateEvent />
        <ToastContainer />
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
