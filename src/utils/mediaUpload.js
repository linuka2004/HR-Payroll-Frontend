import { createClient } from "@supabase/supabase-js";

// Prefer env vars if you add them later, fallback to current values
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

// Upload a single file to the `images` bucket and return its public URL
export default async function uploadFile(file) {
	const timeStamp = Date.now();
	const fileName = `${timeStamp}_${file.name}`;

	// Supabase v2 returns { data, error } instead of throwing
	const { error } = await supabase.storage
		.from("pj images")
		.upload(fileName, file, {
			contentType: file.type,
			cacheControl: "3600",
			upsert: false,
		});

	if (error) {
		// Surface the storage error to callers
		throw error;
	}

	const { data } = supabase.storage.from("pj images").getPublicUrl(fileName);
	return data.publicUrl;
}