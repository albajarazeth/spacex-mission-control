"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Launch } from "@/types";
import { formatLaunchCardDate } from "@/utils/dateFormatter";
import { getCachedLaunchpadName } from "@/services/launchpadService";
import { 
  FaTimes, 
  FaCalendarAlt, 
  FaRocket, 
  FaMapMarkerAlt, 
  FaCheckCircle, 
  FaTimesCircle,
  FaExternalLinkAlt,
  FaPlay,
  FaSatellite,
  FaRedo,
  FaImages
} from "react-icons/fa";
import Image from "next/image";

const rocketNames: Record<string, string> = {
  "5e9d0d95eda69955f709d1eb": "Falcon 1",
  "5e9d0d95eda69973a809d1ec": "Falcon 9",
  "5e9d0d95eda69974db09d1ed": "Falcon Heavy",
  "5e9d0d96eda699382d09d1ee": "Starship",
};

interface LaunchDetailsModalProps {
  launch: Launch | null;
  onClose: () => void;
}

const LaunchDetailsModal = ({ launch, onClose }: LaunchDetailsModalProps) => {
  const [launchpadName, setLaunchpadName] = useState<string>("");
  const [isLoadingLaunchpad, setIsLoadingLaunchpad] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (launch?.launchpad) {
      setIsLoadingLaunchpad(true);
      getCachedLaunchpadName(launch.launchpad)
        .then((name) => {
          setLaunchpadName(name);
          setIsLoadingLaunchpad(false);
        })
        .catch(() => {
          setLaunchpadName(launch.launchpad || "");
          setIsLoadingLaunchpad(false);
        });
    } else {
      setLaunchpadName("");
    }
  }, [launch?.launchpad]);

  useEffect(() => {
    if (launch) {
      document.body.style.overflow = "hidden";
      const previousActiveElement = document.activeElement as HTMLElement;
      
      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        firstFocusable?.focus();
      }, 100);

      return () => {
        document.body.style.overflow = "unset";
        previousActiveElement?.focus();
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [launch]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && launch) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [launch, onClose]);

  if (!launch) return null;

  const rocketName = launch.rocket ? (rocketNames[launch.rocket] || launch.rocket) : "Unknown";
  const patchImage = launch.links?.patch?.large || launch.links?.patch?.small;
  const youtubeId = launch.links?.youtube_id;
  const webcastUrl = launch.links?.webcast;
  const flickrImages = launch.links?.flickr?.original || launch.links?.flickr?.small || [];
  const hasPayloads = launch.payloads && launch.payloads.length > 0;
  const hasCores = launch.cores && launch.cores.length > 0;

  return (
    <AnimatePresence>
      {launch && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.4, 0, 0.2, 1],
              opacity: { duration: 0.2 }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div 
              ref={modalRef}
              className="bg-[#FEFCFB] dark:bg-[#1F2937] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-[#FEFCFB] dark:bg-[#1F2937] border-b border-black/6 dark:border-white/10 px-6 py-4 flex items-start justify-between rounded-t-3xl">
                <div className="flex-1 pr-4">
                  <h2 id="modal-title" className="text-2xl font-bold text-[#1F2937] dark:text-gray-100 mb-2">
                    {launch.name}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-400 text-xl" />
                </button>
              </div>

              <motion.div 
                className="p-6 space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                {(patchImage || youtubeId || flickrImages.length > 0) && (
                  <div className="space-y-4">
                    {youtubeId && (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeId}`}
                          title={launch.name}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    
                    {patchImage && !youtubeId && (
                      <div className="flex justify-center">
                        <div className="relative w-48 h-48 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={patchImage}
                            alt={`${launch.name} mission patch`}
                            fill
                            className="object-contain p-4"
                            unoptimized
                          />
                        </div>
                      </div>
                    )}

                    {flickrImages.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                          <FaImages className="text-[#6366F1]" />
                          Launch Photos
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {flickrImages.slice(0, 4).map((imageUrl, index) => (
                            <div key={index} className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                              <Image
                                src={imageUrl}
                                alt={`${launch.name} photo ${index + 1}`}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <FaCalendarAlt className="text-[#6366F1] text-lg flex-shrink-0" />
                    <div>
                      <span className="font-medium">Launch Date:</span>{" "}
                      <span>{formatLaunchCardDate(launch.date_utc, launch.date_precision)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <FaRocket className="text-[#6366F1] text-lg flex-shrink-0" />
                    <div>
                      <span className="font-medium">Rocket:</span> <span>{rocketName}</span>
                    </div>
                  </div>

                  {launch.launchpad && (
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <FaMapMarkerAlt className="text-[#6366F1] text-lg flex-shrink-0" />
                      <div>
                        <span className="font-medium">Launch Site:</span>{" "}
                        <span>{isLoadingLaunchpad ? "Loading..." : launchpadName || launch.launchpad}</span>
                      </div>
                    </div>
                  )}

                  {hasPayloads && (
                    <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                      <FaSatellite className="text-[#6366F1] text-lg flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Payloads:</span>{" "}
                        <span>{launch.payloads?.length || 0} payload{launch.payloads && launch.payloads.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  )}

                  {hasCores && launch.cores && launch.cores[0] && (
                    <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                      <FaRedo className="text-[#6366F1] text-lg flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div>
                          <span className="font-medium">Core:</span>{" "}
                          <span>Flight {launch.cores[0].flight || "N/A"}</span>
                          {launch.cores[0].reused && (
                            <span className="ml-2 text-[#10B981]">(Reused)</span>
                          )}
                        </div>
                        {launch.cores[0].landing_attempt && (
                          <div className="text-sm">
                            <span className="font-medium">Landing:</span>{" "}
                            {launch.cores[0].landing_success ? (
                              <span className="text-[#10B981]">Successful</span>
                            ) : (
                              <span className="text-[#EF4444]">Failed</span>
                            )}
                            {launch.cores[0].landing_type && (
                              <span className="ml-1">({launch.cores[0].landing_type})</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {launch.success !== null && !launch.upcoming && (
                    <div className="flex items-center gap-3">
                      {launch.success ? (
                        <>
                          <FaCheckCircle className="text-[#10B981] text-lg flex-shrink-0" />
                          <div className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Status:</span>{" "}
                            <span className="text-[#10B981] font-semibold">Successful</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="text-[#EF4444] text-lg flex-shrink-0" />
                          <div className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Status:</span>{" "}
                            <span className="text-[#EF4444] font-semibold">Failed</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {launch.upcoming && (
                    <div className="flex items-center gap-3">
                      <FaRocket className="text-[#6366F1] text-lg flex-shrink-0" />
                      <div className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Status:</span>{" "}
                        <span className="text-[#6366F1] font-semibold">Upcoming</span>
                      </div>
                    </div>
                  )}
                </div>

                {launch.details && (
                  <div className="pt-4 border-t border-black/6 dark:border-white/10">
                    <h3 className="text-lg font-semibold text-[#1F2937] dark:text-gray-100 mb-3">
                      Mission Description
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {launch.details}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-4 border-t border-black/6 dark:border-white/10">
                  {webcastUrl && (
                    <a
                      href={webcastUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-full hover:bg-[#4F46E5] transition-colors transition-all duration-200 hover:shadow-md cursor-pointer"
                    >
                      <FaPlay className="text-sm" />
                      <span>Watch Launch</span>
                    </a>
                  )}
                  {launch.links?.article && (
                    <a
                      href={launch.links.article}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-[#1F2937] dark:text-gray-100 border border-black/10 dark:border-white/10 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <FaExternalLinkAlt className="text-sm" />
                      <span>View Article</span>
                    </a>
                  )}
                  {launch.links?.wikipedia && (
                    <a
                      href={launch.links.wikipedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-[#1F2937] dark:text-gray-100 border border-black/10 dark:border-white/10 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <FaExternalLinkAlt className="text-sm" />
                      <span>Wikipedia</span>
                    </a>
                  )}
                  {launch.links?.reddit?.launch && (
                    <a
                      href={launch.links.reddit.launch}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-[#1F2937] dark:text-gray-100 border border-black/10 dark:border-white/10 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <FaExternalLinkAlt className="text-sm" />
                      <span>Reddit</span>
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LaunchDetailsModal;

