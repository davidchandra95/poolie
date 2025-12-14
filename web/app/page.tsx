"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { SearchForm } from "@/components/search-form";
import { SearchParams } from "@/lib/types";

export default function Home() {
  const router = useRouter();

  function handleSearch(params: SearchParams) {
    const queryParams = new URLSearchParams();
    if (params.originCity && params.originCity !== "all") queryParams.set("originCity", params.originCity);
    if (params.originLocation) queryParams.set("originLocation", params.originLocation);
    if (params.destinationCity && params.destinationCity !== "all") queryParams.set("destinationCity", params.destinationCity);
    if (params.destinationLocation) queryParams.set("destinationLocation", params.destinationLocation);
    if (params.date) queryParams.set("date", params.date);
    if (params.passengers) queryParams.set("passengers", params.passengers.toString());
    if (params.type && params.type !== "all") queryParams.set("type", params.type);

    router.push(`/search?${queryParams.toString()}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] py-12">
            {/* Left side - Search Form */}
            <div className="order-2 lg:order-1">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Nebeng kemana aja, hemat bareng
              </h1>
              <SearchForm onSearch={handleSearch} />
            </div>

            {/* Right side - Hero Image */}
            <div className="order-1 lg:order-2">
              <div className="relative aspect-square lg:aspect-auto lg:h-[600px] rounded-lg overflow-hidden">
                <Image
                  src="/car-sharing-service.jpg"
                  alt="Car sharing service"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end z-10">
                  <div className="text-white p-8">
                    <p className="text-2xl font-semibold">Perjalanan dimulai di sini</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Hemat Biaya</h3>
              <p className="text-gray-600 text-sm">Dengan berbagi kendaraan, kamu bisa patungan bensin, tol, dan parkir. Lumayan banget uangnya bisa buat nambah jajan kopi.</p>
            </div>
            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Kurangi Kemacetan</h3>
              <p className="text-gray-600 text-sm">Satu mobil buat beberapa orang tuh udah bantu banget ngurangin penumpukan di jalan. Perjalanan jadi lebih santai, nggak terlalu stres, dan bisa sambil ngobrol seru di mobil.</p>
            </div>
            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Lebih Ramah Lingkungan</h3>
              <p className="text-gray-600 text-sm">Nebeng bareng bikin jejak karbon makin kecil karena jumlah mobil yang dipakai berkurang. Sedikit-sedikit, kita barengan ikut bantu jaga bumi sambil tetap menikmati perjalanan yang nyaman.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
