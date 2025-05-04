
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Query the services table
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('category');
    
    if (error) throw error;
    
    // Return the services
    return new Response(JSON.stringify({ 
      services, 
      timestamp: new Date().toISOString() 
    }), {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      }
    });
  } catch (error) {
    console.error('Error in get-services function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      }
    });
  }
});
