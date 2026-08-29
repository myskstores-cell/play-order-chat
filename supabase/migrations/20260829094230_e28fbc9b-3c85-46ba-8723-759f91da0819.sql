CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  compare_at_price NUMERIC(10,2),
  image_url TEXT,
  size TEXT,
  brand TEXT,
  sport TEXT,
  gender TEXT,
  material TEXT,
  stock_status TEXT NOT NULL DEFAULT 'in_stock',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_products_featured ON public.products(is_featured);
CREATE INDEX idx_products_sport ON public.products(sport);
CREATE INDEX idx_products_brand ON public.products(brand);

GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active categories are publicly viewable"
  ON public.categories FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Active products are publicly viewable"
  ON public.products FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.categories (name, slug, description, image_url, sort_order) VALUES
 ('Cricket','cricket','Bats, balls, pads, gloves and cricket essentials.','/images/cat-cricket.jpg',1),
 ('Football','football','Footballs, boots, shin guards and training gear.','/images/cat-football.jpg',2),
 ('Badminton','badminton','Rackets, shuttles, grips and badminton accessories.','/images/cat-badminton.jpg',3),
 ('Tennis','tennis','Tennis rackets, balls and court accessories.','/images/cat-tennis.jpg',4),
 ('Basketball','basketball','Basketballs, hoops and court gear.','/images/cat-basketball.jpg',5),
 ('Running','running','Running shoes, belts and hydration gear.','/images/cat-running.jpg',6),
 ('Fitness & Gym','fitness-gym','Dumbbells, mats, resistance bands and gym equipment.','/images/cat-fitness.jpg',7),
 ('Sports Shoes','sports-shoes','Footwear for every sport and surface.','/images/cat-shoes.jpg',8),
 ('Sports Apparel','sports-apparel','Jerseys, shorts, track pants and training wear.','/images/cat-apparel.jpg',9),
 ('Sports Accessories','sports-accessories','Bags, bottles, grips and everyday sports extras.','/images/cat-accessories.jpg',10),
 ('Protective Gear','protective-gear','Guards, helmets and protection for safe play.','/images/cat-protective.jpg',11);

INSERT INTO public.products (category_id, name, slug, sku, short_description, description, price, compare_at_price, image_url, size, brand, sport, gender, material, stock_status, is_featured, sort_order)
SELECT c.id, v.name, v.slug, v.sku, v.short_description, v.description, v.price, v.compare_at_price, v.image_url, v.size, v.brand, v.sport, v.gender, v.material, v.stock_status, v.is_featured, v.sort_order
FROM (VALUES
 ('cricket','Professional English Willow Cricket Bat','professional-english-willow-cricket-bat','SK001','Grade 1 English willow bat with a full profile.','Grade 1 English willow with a thick edge profile, semi-oval handle and a balanced pickup for stroke play on turf wickets. Knocked-in ready with a protective face sheet.',8499,10999,'/images/cat-cricket.jpg','SH','SK Pro','Cricket','unisex','English Willow','in_stock',true,1),
 ('cricket','Kashmir Willow Cricket Bat','kashmir-willow-cricket-bat','SK002','Durable Kashmir willow bat for practice and club games.','Kashmir willow blade with a cane handle and rubber grip. A dependable everyday bat for nets, tennis-ball and club cricket.',2199,2799,'/images/cat-cricket.jpg','SH','SK Pro','Cricket','unisex','Kashmir Willow','in_stock',false,2),
 ('cricket','Leather Cricket Ball (Match)','leather-cricket-ball-match','SK003','Hand-stitched four-piece leather match ball.','Four-piece hand-stitched alum-tanned leather ball with a cork core and pronounced seam for consistent swing and shape retention.',949,1199,'/images/cat-cricket.jpg','156g','SK Pro','Cricket','unisex','Leather','in_stock',true,3),
 ('cricket','Batting Gloves Pro','cricket-batting-gloves-pro','SK004','Cotton-padded batting gloves with sausage fingers.','High-density foam protection, sausage-finger design and a breathable towelling back for grip and comfort during long innings.',1499,1899,'/images/cat-cricket.jpg','Mens','SK Pro','Cricket','men','Leather / Cotton','in_stock',false,4),
 ('cricket','Batting Pads Lightweight','cricket-batting-pads-lightweight','SK005','Lightweight moulded batting pads.','Lightweight high-density foam pads with cane reinforcement, moulded knee roll and quick-release straps.',2299,NULL,'/images/cat-protective.jpg','Mens','SK Pro','Cricket','men','PU / Foam','in_stock',false,5),
 ('football','Match Football Size 5','match-football-size-5','SK010','Thermo-bonded size 5 match football.','Thermo-bonded seamless surface with a butyl bladder for reliable air retention and true flight. FIFA-size 5 for full-pitch matches.',1799,2299,'/images/cat-football.jpg','5','Strikeline','Football','unisex','PU','in_stock',true,1),
 ('football','Training Football Size 4','training-football-size-4','SK011','Durable machine-stitched training ball.','Machine-stitched TPU cover with a nylon-wound bladder built for daily training on turf and hard ground.',899,NULL,'/images/cat-football.jpg','4','Strikeline','Football','unisex','TPU','in_stock',false,2),
 ('football','Firm Ground Football Boots','firm-ground-football-boots','SK012','Lightweight FG boots with moulded studs.','Soft synthetic upper with a textured strike zone, moulded conical studs and a lightweight TPU outsole for firm natural ground.',3299,4199,'/images/cat-shoes.jpg','UK 6-11','Strikeline','Football','men','Synthetic','in_stock',true,3),
 ('football','Shin Guards with Ankle Sleeve','shin-guards-with-ankle-sleeve','SK013','Impact shell shin guards with ankle protection.','Hard polypropylene shell with EVA backing and a compression ankle sleeve for slip-free protection.',649,849,'/images/cat-protective.jpg','M','Strikeline','Football','unisex','PP / EVA','in_stock',false,4),
 ('badminton','Carbon Badminton Racket','carbon-badminton-racket','SK020','Full carbon graphite racket, head-light balance.','Full graphite shaft and frame with an isometric head and head-light balance for fast defence and quick net play. Includes full cover.',2499,3199,'/images/cat-badminton.jpg','G4','Featherline','Badminton','unisex','Carbon Graphite','in_stock',true,1),
 ('badminton','Aluminium Badminton Racket Set (2)','aluminium-badminton-racket-set','SK021','Two-racket recreational set with cover.','Steel shaft and aluminium head rackets, factory strung, supplied as a pair with a carry cover. Ideal for casual play.',1199,1599,'/images/cat-badminton.jpg','G4','Featherline','Badminton','unisex','Aluminium','in_stock',false,2),
 ('badminton','Nylon Shuttlecocks (Pack of 6)','nylon-shuttlecocks-pack-of-6','SK022','Durable nylon shuttles for regular play.','Medium-speed nylon shuttles with a natural cork base offering long life on wooden and synthetic courts.',549,699,'/images/cat-badminton.jpg','Medium','Featherline','Badminton','unisex','Nylon / Cork','in_stock',false,3),
 ('badminton','Feather Shuttlecocks (Tube of 12)','feather-shuttlecocks-tube-of-12','SK023','Class-grade goose feather shuttles.','Goose feather shuttles with a hand-selected cork base for tournament-level flight and stability.',1899,NULL,'/images/cat-badminton.jpg','77','Featherline','Badminton','unisex','Feather / Cork','low_stock',false,4),
 ('tennis','Graphite Tennis Racket','graphite-tennis-racket','SK030','Graphite composite racket with a 100 sq. in head.','Graphite composite frame with a 100 sq. in. head, 27 inch length and cushioned grip for power with control.',3599,4499,'/images/cat-tennis.jpg','G3','Baseline','Tennis','unisex','Graphite','in_stock',true,1),
 ('tennis','Championship Tennis Balls (Can of 3)','championship-tennis-balls-can-of-3','SK031','Pressurised balls for hard and clay courts.','Woven felt over a pressurised rubber core for consistent bounce and durability across surfaces.',549,NULL,'/images/cat-tennis.jpg','Standard','Baseline','Tennis','unisex','Felt / Rubber','in_stock',false,2),
 ('basketball','Indoor / Outdoor Basketball Size 7','indoor-outdoor-basketball-size-7','SK040','All-surface composite basketball.','Deep-channel composite leather cover with butyl bladder for grip and bounce indoors and on concrete courts.',1699,2199,'/images/cat-basketball.jpg','7','Rimline','Basketball','unisex','Composite Leather','in_stock',true,1),
 ('basketball','Basketball Hoop Ring with Net','basketball-hoop-ring-with-net','SK041','Powder-coated steel ring with nylon net.','Heavy-gauge powder-coated steel ring with mounting plate and a weather-resistant nylon net.',2299,NULL,'/images/cat-basketball.jpg','18 inch','Rimline','Basketball','unisex','Steel / Nylon','in_stock',false,2),
 ('running','Lightweight Running Shoes','lightweight-running-shoes','SK050','Cushioned daily trainers with breathable mesh.','Engineered mesh upper with a compression-moulded EVA midsole and high-abrasion rubber outsole for daily road running.',3499,4599,'/images/cat-shoes.jpg','UK 6-11','Pacer','Running','men','Mesh / EVA','in_stock',true,1),
 ('running','Womens Running Shoes','womens-running-shoes','SK051','Soft-cushion trainers built on a womens last.','Breathable knit upper on a womens-specific last with a soft rebound midsole for comfort over long distances.',3299,3999,'/images/cat-shoes.jpg','UK 3-8','Pacer','Running','women','Knit / EVA','in_stock',false,2),
 ('running','Running Waist Belt','running-waist-belt','SK052','Stretch belt for phone, keys and gels.','Sweat-resistant stretch fabric belt with a bounce-free fit and a zipped pocket for phone and essentials.',499,699,'/images/cat-accessories.jpg','Free','Pacer','Running','unisex','Lycra','in_stock',false,3),
 ('fitness-gym','PVC Dumbbell Set (Pair)','pvc-dumbbell-set-pair','SK060','Vinyl-coated dumbbells for home workouts.','Vinyl-coated cast iron dumbbells with a knurled grip. Sold as a pair for home strength training.',1299,1699,'/images/cat-fitness.jpg','5 kg','IronCore','Fitness','unisex','Cast Iron / PVC','in_stock',true,1),
 ('fitness-gym','Adjustable Skipping Rope','adjustable-skipping-rope','SK061','Ball-bearing speed rope.','Ball-bearing steel-wire rope with foam grips and adjustable length for speed and conditioning work.',399,549,'/images/cat-fitness.jpg','3 m','IronCore','Fitness','unisex','Steel / Foam','in_stock',false,2),
 ('fitness-gym','Anti-Slip Yoga Mat 6mm','anti-slip-yoga-mat-6mm','SK062','Cushioned 6mm mat with carry strap.','6mm high-density NBR mat with a textured anti-slip surface, closed-cell top and a carry strap.',899,1199,'/images/cat-fitness.jpg','6 mm','IronCore','Fitness','unisex','NBR Foam','in_stock',false,3),
 ('fitness-gym','Resistance Band Set (5 Levels)','resistance-band-set-5-levels','SK063','Five loop bands from light to extra heavy.','Five natural latex loop bands covering light to extra-heavy resistance, with a mesh carry pouch.',699,999,'/images/cat-fitness.jpg','Set of 5','IronCore','Fitness','unisex','Latex','in_stock',false,4),
 ('sports-shoes','All-Court Sports Shoes','all-court-sports-shoes','SK070','Non-marking shoes for indoor courts.','Non-marking gum rubber outsole with a reinforced toe drag pad and cushioned insole for badminton and indoor courts.',2799,3499,'/images/cat-shoes.jpg','UK 6-11','SK Pro','Badminton','unisex','Synthetic / Rubber','in_stock',false,1),
 ('sports-shoes','Cricket Spikes','cricket-spikes','SK071','Half-spike cricket shoes for turf.','Lightweight synthetic upper with a half-spike outsole for grip on turf, plus a cushioned heel for bowlers.',3899,NULL,'/images/cat-shoes.jpg','UK 6-11','SK Pro','Cricket','men','Synthetic','low_stock',false,2),
 ('sports-apparel','Dry-Fit Training T-Shirt','dry-fit-training-t-shirt','SK080','Moisture-wicking polyester tee.','Lightweight moisture-wicking polyester with mesh side panels and flatlock seams to prevent chafing.',699,999,'/images/cat-apparel.jpg','S-XXL','SK Pro','Training','unisex','Polyester','in_stock',true,1),
 ('sports-apparel','Training Shorts with Pockets','training-shorts-with-pockets','SK081','Quick-dry shorts with zip pockets.','Quick-dry woven shorts with an elastic drawcord waist and two zip pockets for phone and keys.',799,1099,'/images/cat-apparel.jpg','S-XXL','SK Pro','Training','men','Polyester','in_stock',false,2),
 ('sports-apparel','Track Pants Slim Fit','track-pants-slim-fit','SK082','Tapered track pants for training and travel.','Brushed-back knit track pants with a tapered leg, ribbed cuffs and zip pockets.',1199,1599,'/images/cat-apparel.jpg','S-XXL','SK Pro','Training','unisex','Cotton Blend','in_stock',false,3),
 ('sports-accessories','Sports Kit Bag 45L','sports-kit-bag-45l','SK090','Large duffel with a separate shoe pocket.','45L water-resistant polyester duffel with a ventilated shoe compartment, padded shoulder strap and reinforced base.',1499,1999,'/images/cat-accessories.jpg','45 L','SK Pro','Multi-Sport','unisex','Polyester','in_stock',true,1),
 ('sports-accessories','Stainless Steel Sports Bottle 750ml','stainless-steel-sports-bottle-750ml','SK091','Insulated bottle with a leak-proof cap.','Double-wall vacuum-insulated stainless steel bottle with a leak-proof sports cap. Keeps drinks cold for hours.',799,1099,'/images/cat-accessories.jpg','750 ml','SK Pro','Multi-Sport','unisex','Stainless Steel','in_stock',false,2),
 ('sports-accessories','Cotton Sports Socks (Pack of 3)','cotton-sports-socks-pack-of-3','SK092','Cushioned ankle socks, three pairs.','Combed cotton blend ankle socks with a cushioned sole and arch support band. Pack of three pairs.',449,599,'/images/cat-apparel.jpg','Free','SK Pro','Multi-Sport','unisex','Cotton Blend','in_stock',false,3),
 ('protective-gear','Cricket Helmet with Grille','cricket-helmet-with-grille','SK100','Steel-grille helmet with adjustable fit.','ABS shell with high-density foam lining, adjustable steel grille and a rear dial for a secure fit.',2899,3599,'/images/cat-protective.jpg','M/L','SK Pro','Cricket','unisex','ABS / Steel','in_stock',true,1),
 ('protective-gear','Abdominal Guard','abdominal-guard','SK101','Moulded protector for batting and keeping.','Impact-moulded polypropylene guard with soft edging and a comfortable contoured fit.',399,NULL,'/images/cat-protective.jpg','Mens','SK Pro','Cricket','men','Polypropylene','in_stock',false,2),
 ('protective-gear','Knee & Elbow Guard Set','knee-elbow-guard-set','SK102','Padded guards for court and skating.','Hard-cap knee and elbow guards with padded lining and adjustable elastic straps.',999,1399,'/images/cat-protective.jpg','M','SK Pro','Multi-Sport','unisex','PP / EVA','in_stock',false,3)
) AS v(cat_slug,name,slug,sku,short_description,description,price,compare_at_price,image_url,size,brand,sport,gender,material,stock_status,is_featured,sort_order)
JOIN public.categories c ON c.slug = v.cat_slug;