-- Create SERVICE CATEGORY table
CREATE TABLE "SERVICE CATEGORY" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER,
  airlines VARCHAR NOT NULL,
  category VARCHAR NOT NULL
);

-- Create SMALL PROPELLER table
CREATE TABLE "SMALL PROPELLER" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER,
  point_1 VARCHAR NOT NULL,
  point_2 VARCHAR NOT NULL,
  ceiling_price_full_service INTEGER,
  floor_price_full_service INTEGER,
  ceiling_price_medium_service INTEGER,
  floor_price_medium_service INTEGER,
  ceiling_price_no_frills INTEGER,
  floor_price_no_frills INTEGER
);

-- Create BIG PROPELLER table
CREATE TABLE "BIG PROPELLER" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER,
  point_1 VARCHAR NOT NULL,
  point_2 VARCHAR NOT NULL,
  ceiling_price_full_service INTEGER,
  floor_price_full_service INTEGER,
  ceiling_price_medium_service INTEGER,
  floor_price_medium_service INTEGER,
  ceiling_price_no_frills INTEGER,
  floor_price_no_frills INTEGER
);

-- Create JET table
CREATE TABLE "JET" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER,
  point_1 VARCHAR NOT NULL,
  point_2 VARCHAR NOT NULL,
  ceiling_price_full_service INTEGER,
  floor_price_full_service INTEGER,
  ceiling_price_medium_service INTEGER,
  floor_price_medium_service INTEGER,
  ceiling_price_no_frills INTEGER,
  floor_price_no_frills INTEGER
); 