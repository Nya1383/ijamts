import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="bg-[var(--secondary-background)] py-16">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <Image 
              src="/logo.png" 
              alt="IJAMTS Logo" 
              width={150} 
              height={150} 
              className="rounded-md"
            />
          </div>
          <div className="mb-6 flex justify-center">
            <Image 
              src="/ijamts-text.svg" 
              alt="IJAMTS" 
              width={250} 
              height={80} 
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--foreground)]">
            International Journal of Advances in Management, Technology and Science
          </h1>
          <p className="text-xl text-[var(--secondary-text)] mb-8">
            Advancing knowledge through innovative research and technological excellence
          </p>
          <a href="/submission" className="btn btn-primary text-lg">
            Submit Your Article
          </a>
        </div>
      </div>
    </section>
  );
} 