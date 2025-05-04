
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Hono } from 'https://deno.land/x/hono@v3.12.5/mod.ts';
import { cors } from 'https://deno.land/x/hono@v3.12.5/middleware.ts';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

// Create a new Hono app
const app = new Hono();

// Apply CORS middleware
app.use('/*', cors({
  origin: '*',
  allowHeaders: ['authorization', 'x-client-info', 'apikey', 'content-type'],
}));

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Middleware to verify JWT token
const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getUser(token);
  
  if (error || !data.user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // User is authenticated, proceed
  c.set('user', data.user);
  return await next();
};

// Get all services - GET /
app.get('/', async (c) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('category');
  
  if (error) {
    return c.json({ error: error.message }, 500);
  }
  
  return c.json({ services: data, timestamp: new Date().toISOString() });
});

// Create new service (requires authentication) - POST /
app.post('/', authMiddleware, async (c) => {
  const body = await c.req.json();
  
  // Validate required fields
  if (!body.name || !body.price || !body.duration || !body.category) {
    return c.json({ error: 'Missing required fields' }, 400);
  }
  
  const { data, error } = await supabase
    .from('services')
    .insert({
      name: body.name,
      description: body.description || null,
      price: body.price,
      duration: body.duration,
      category: body.category
    })
    .select();
  
  if (error) {
    return c.json({ error: error.message }, 500);
  }
  
  return c.json({ success: true, service: data[0] });
});

// Update service (requires authentication) - PUT /
app.put('/', authMiddleware, async (c) => {
  const body = await c.req.json();
  const id = body.id;
  
  if (!id) {
    return c.json({ error: 'Service ID is required' }, 400);
  }
  
  // Validate required fields
  if ((!body.name && !body.price && !body.duration && !body.category && !body.description)) {
    return c.json({ error: 'No fields to update' }, 400);
  }
  
  // Create an update object with only the fields provided
  const updateData: any = {};
  if (body.name) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.price) updateData.price = body.price;
  if (body.duration) updateData.duration = body.duration;
  if (body.category) updateData.category = body.category;
  updateData.updated_at = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('services')
    .update(updateData)
    .eq('id', id)
    .select();
  
  if (error) {
    return c.json({ error: error.message }, 500);
  }
  
  if (!data || data.length === 0) {
    return c.json({ error: 'Service not found' }, 404);
  }
  
  return c.json({ success: true, service: data[0] });
});

// Delete service (requires authentication) - DELETE /
app.delete('/', authMiddleware, async (c) => {
  const body = await c.req.json();
  const id = body.id;
  
  if (!id) {
    return c.json({ error: 'Service ID is required' }, 400);
  }
  
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) {
    return c.json({ error: error.message }, 500);
  }
  
  return c.json({ success: true });
});

// Serve the Hono app using Deno's serve function
serve((req) => app.fetch(req));
