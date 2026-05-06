import { createClient } from '@supabase/supabase-js';

export default async function Page() {
  // 1. Ensure env variables are loaded properly
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are not defined.');
  }

  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key:', supabaseKey);

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 2. Fetch the data
  const { data, error } = await supabase.from('home').select('*');
  console.log('Error:', error);

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}