import axios from "axios";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import Loader from "../../components/loader";
import { GoVerified } from "react-icons/go";

export default function AdminUsersPage() {
	const [users, setUsers] = useState([]);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (!loaded) {
			axios
				.get(import.meta.env.VITE_BACKEND_URL + "/users/all", {
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token"),
					},
				})
				.then((response) => {
					console.log(response.data);
					setUsers(response.data);
					setLoaded(true);
				});
		}
	}, [loaded]);

	return (
		<div
			className="w-full min-h-screen flex justify-center px-4 py-6 sm:px-6 md:px-10 relative
	      bg-gradient-to-b from-primary to-white text-secondary"
		>
			{loaded ? (
				<div className="w-full max-w-7xl overflow-x-auto">
				<table
					className="w-full min-w-[900px] table-auto border-separate border-spacing-0
	        rounded-2xl overflow-hidden shadow-xl bg-white/70 
	        "
				>
					<thead className="sticky top-0 z-10">
						<tr className="bg-secondary text-primary/95">
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Image
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Email
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								First Name
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Last Name
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Role
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								status
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"></th>
						</tr>
					</thead>

					<tbody className="divide-y divide-secondary/10">
						{users.map((item, index) => {
							return (
								<tr
									key={index}
									className="odd:bg-primary/60 even:bg-white hover:bg-primary/90 transition-colors"
								>
									<td className="px-4 py-3 align-middle">
										<img
											src={item.image}
											className="w-[38px] h-[38px] rounded-lg object-cover ring-1 ring-secondary/10 shadow-sm"
										/>
									</td>
									<td className="px-4 py-3 text-sm font-medium text-secondary/90 flex flex-row items-center gap-2">
										{item.email} {item.isEmailVerified ? <GoVerified className="text-blue-400" /> : ""}
									</td>
									<td className="px-4 py-3 text-sm">{item.firstName}</td>
									<td className="px-4 py-3 text-sm font-semibold text-secondary">
										{item.lastName}
									</td>
									<td className="px-4 py-3 text-sm font-semibold text-secondary">
										{item.role}
									</td>
									<td className="px-4 py-3 text-sm">
                    {item.isBlocked ? "Blocked" : "Active"}
                  </td>
									<td className="px-4 py-3 text-sm">
                  <button
                    className="px-3 py-1 bg-accent text-primary rounded-lg cursor-pointer hover:bg-accent/90 transition-all"
                    onClick={
                      async ()=>{
                      await axios.put(import.meta.env.VITE_BACKEND_URL + `/users/toggle-block/${item.email}`,{
                         isBlocked: !item.isBlocked
                       },
                       {
                         headers: {  
                         Authorization: `Bearer ${localStorage.getItem("token")}`
                         }
                       });
                       setLoaded(false);
                    }
                   }   
                   >
                 {
                 item.isBlocked?"Unblock User":"Block User"
                  }
                 </button>
               </td>
								</tr>
							);
						})}
					</tbody>
				</table>
				</div>
			) : (
				<Loader />
			)}

			<Link
				to="/admin/add-user"
				className="fixed right-[20px] bottom-[20px] w-[56px] h-[56px]
        flex justify-center items-center text-4xl rounded-full
        bg-accent text-primary shadow-2xl ring-2 ring-accent/30
        hover:scale-105 hover:shadow-[0_12px_24px_-6px_rgba(0,0,0,0.35)]
        active:scale-95 transition-all"
			>
				<BiPlus />
			</Link>
		</div>
	);
}