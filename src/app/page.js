import TaskApp from "./components/TaskApp";
export default function Home() {
  return (
    <main className="w-full h-full p-4 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-black">RivCode TaskFlow</h1>
      <TaskApp />
    </main>
  );
}
