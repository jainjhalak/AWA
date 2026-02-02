import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { BugPlay, PauseOctagon, Repeat, Shuffle, SkipBack, SkipForward, Volume1 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControl = () => {
	const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();

	const [volume, setVolume] = useState(75);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		audioRef.current = document.querySelector("audio");

		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => setCurrentTime(audio.currentTime);
		const updateDuration = () => setDuration(audio.duration);

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("loadedmetadata", updateDuration);

		const handleEnded = () => {
			usePlayerStore.setState({ isPlaying: false });
		};

		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("ended", handleEnded);
		};
	}, [currentSong]);

	const handleSeek = (value: number[]) => {
		if (audioRef.current) {
			audioRef.current.currentTime = value[0];
		}
	};

	return (
		<footer className='h-20 sm:h-24 bg-lime-950 border-t border-lime-950 px-4'>
			<div className='flex justify-between items-center h-full max-w-450 mx-auto'>
				{/* currently playing song */}
				<div className='hidden sm:flex items-center gap-4 min-w-45 w-[30%]'>
					{currentSong && (
						<>
							<img
								src={currentSong.imageUrl}
								alt={currentSong.title}
								className='w-14 h-14 object-cover rounded-md text-lime-100'/>

							<div className='flex-1 min-w-0'>
								<div className='font-medium truncate hover:underline cursor-pointer text-lime-100'>
									{currentSong.title}
								</div>

								<div className='text-sm text-lime-600 truncate hover:underline cursor-pointer'>
									{currentSong.artist}
								</div>
							</div>
						</>
					)}
				</div>

				{/* player controls*/}
				<div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
					<div className='flex items-center gap-4 sm:gap-6'>
						<Button className='hidden sm:inline-flex hover:text-white text-lime-100'
							    size='icon'
							    variant='ghost'>
							<Shuffle className='h-4 w-4' />
						</Button>

						<Button className='hover:text-white text-lime-100'
							    size='icon'
							    variant='ghost'
							    onClick={playPrevious}
							    disabled={!currentSong}>
							<SkipBack className='h-4 w-4' />
						</Button>

						<Button className='bg-lime-100 hover:bg-lime-300 text-black rounded-full h-8 w-8'
							    size='icon'
							    onClick={togglePlay}
							    disabled={!currentSong}>

							{isPlaying ? <PauseOctagon className='h-5 w-5' /> : <BugPlay className='h-5 w-5' />}
						</Button>

						<Button className='hover:text-white text-lime-100'
							    size='icon'
							    variant='ghost'
							    onClick={playNext}
								disabled={!currentSong}>
							<SkipForward className='h-4 w-4' />
						</Button>

						<Button className='hidden sm:inline-flex hover:text-white text-lime-100'
								size='icon'
								variant='ghost'>
							<Repeat className='h-4 w-4' />
						</Button>
					</div>

					<div className='hidden sm:flex items-center gap-2 w-full'>
						<div className='text-xs text-lime-100'>{formatTime(currentTime)}</div>
						<Slider className='w-full hover:cursor-grab active:cursor-grabbing'
								value={[currentTime]}
								max={duration || 100}
								step={1}
							 	onValueChange={handleSeek} />

						<div className='text-xs text-lime-100'>{formatTime(duration)}</div>
					</div>
				</div>

				{/* volume controls */}
				<div className='hidden sm:flex items-center gap-4 min-w-45 w-[30%] justify-end'>

					<div className='flex items-center gap-2'>
						<Button size='icon' variant='ghost' className='hover:text-white text-lime-100'>
							<Volume1 className='h-4 w-4' />
						</Button>

						<Slider className='w-24 hover:cursor-grab active:cursor-grabbing text-lime-100'
								value={[volume]}
								max={100}
								step={1}
								onValueChange={(value) => {
								  setVolume(value[0]);
									if (audioRef.current) {
										audioRef.current.volume = value[0] / 100;
									}
							}}
						/>
					</div>
				</div>
			</div>
		</footer>
	);
};