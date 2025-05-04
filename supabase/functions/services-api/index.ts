
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

// Get all services
app.get('/services', async (c) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('category');
  
  if (error) {
    return c.json({ error: error.message }, 500);
  }
  
  return c.json({ services: data, timestamp: new Date().toISOString() });
});

// Create new service (requires authentication)
app.post('/services', authMiddleware, async (c) => {
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

// Update service (requires authentication)
app.put('/services/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  
  // Validate required fields
  if ((!body.name && !body.price && !body.duration && !body.category && !body.description)) {
    return c.json({ error: 'No fields to update' }, 400);
  }
  
  const { data, error } = await supabase
    .from('services')
    .update({
      name: body.name,
      description: body.description,
      price: body.price,
      duration: body.duration,
      category: body.category,
      updated_at: new Date().toISOString()
    })
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

// Delete service (requires authentication)
app.delete('/services/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  
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
