import { useMusicStore } from "@/stores/useMusicStore"
import { LibraryBig, ListMusic, PlayCircle, UsersRound } from "lucide-react";
import StatsCard from "./StatsCard";

const DashboardStats = () => {
  const {stats} = useMusicStore();

  // 4 diff objects for stats
  const statsData = [
		{
			icon: ListMusic,
			label: "Total Songs",
			value: stats.totalSongs.toString(),
			bgColor: "bg-cyan-700",
			iconColor: "text-teal-100",
		},
		{
			icon: UsersRound,
			label: "Total Artists",
			value: stats.totalArtists.toString(),
			bgColor: "bg-cyan-700",
			iconColor: "text-orange-500",
		},
		{
			icon: PlayCircle,
			label: "Total Users",
			value: stats.totalUsers.toLocaleString(),
			bgColor: "bg-cyan-700",
			iconColor: "text-sky-500",
		},

		{
			icon: LibraryBig,
			label: "Total Albums",
			value: stats.totalAlbums.toString(),
			bgColor: "bg-cyan-700",
			iconColor: "text-violet-500",
		},
	];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat) => (
        <StatsCard 
           key={stat.label}
           icon={stat.icon}
           label={stat.label}
           value={stat.value}
           bgColor={stat.bgColor}
           iconColor={stat.iconColor} />
      ))}
    </div>
  )
}

export default DashboardStats
