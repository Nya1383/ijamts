import HeroSection from "@/components/HeroSection";
import MainContent from "@/components/MainContent";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div>
      <HeroSection />
      
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MainContent />
          </div>
          <div className="lg:col-span-1 py-13.5">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
