import { Model } from 'mongoose';

export type IStreet =
  | 'Kemal Ataturk Avenue'
  | 'Bangabandhu Avenue'
  | 'Shahbagh Avenue'
  | 'New Eskaton Road'
  | 'Bijoy Sarani'
  | 'Manik Mia Avenue'
  | 'Pragati Sarani (Mirpur Road)'
  | 'Elephant Road'
  | 'Dhanmondi Road'
  | 'Gulshan Avenue'
  | 'Banani Road'
  | 'Mohakhali Flyover'
  | 'Kakrail Road'
  | 'Motijheel C/A (Commercial Area)'
  | 'Farmgate Road'
  | 'Mirpur Road'
  | 'Shyamoli Square'
  | 'Tejgaon Industrial Area'
  | 'Karwan Bazar'
  | 'Green Road'
  | 'Moghbazar'
  | 'Malibagh Chowdhurypara Road'
  | 'Bijoynagar Road'
  | 'Wari Road'
  | 'Siddeswari Circular Road'
  | 'Kakrail Road'
  | 'Satmasjid Road'
  | 'Mohammadpur Bus Stand Road'
  | 'Kazi Nazrul Islam Avenue (Airport Road)'
  | 'Satrasta Road'
  | 'Siddikbazar Road'
  | 'Lalbagh Road'
  | 'Chankharpul Road'
  | 'Badda Link Road'
  | 'Niketan Road'
  | 'Malibagh Chowdhurypara Road'
  | 'Rampura Road'
  | 'Siddeshwari Circular Road'
  | 'Baily Road'
  | 'Hatirjheel Link Road'
  | 'Others';

export type IArea =
  | 'Uttara'
  | 'Gulshan'
  | 'Banani'
  | 'Dhanmondi'
  | 'Mohakhali'
  | 'Mirpur'
  | 'Motijheel'
  | 'Mohammadpur'
  | 'Malibagh'
  | 'Farmgate'
  | 'Karwan Bazar'
  | 'Jatrabari'
  | 'Khilgaon'
  | 'Badda'
  | 'Pallabi'
  | 'Shantinagar'
  | 'Azimpur'
  | 'Rampura'
  | 'Savar'
  | 'Baridhara'
  | 'Basabo'
  | 'Jigatola'
  | 'Kamalapur'
  | 'Lalmatia'
  | 'Niketan'
  | 'Shyamoli'
  | 'Tikatuli'
  | 'Tongi'
  | 'Wari'
  | 'Tejgaon'
  | 'Mohakhali DOHS'
  | 'Agargaon Mirpur DOHS'
  | 'Baridhara DOHS'
  | 'Adabar'
  | 'Rayer Bazar'
  | 'Baily Road'
  | 'Mohammadpur Housing Estate'
  | 'Sher-e-Bangla Nagar'
  | 'Segun Bagicha'
  | 'Shewrapara'
  | 'Banasree'
  | 'Merul Badda'
  | 'Hazaribagh'
  | 'Pallabi Housing Estate'
  | 'Nikunja'
  | 'Wari-Gulistan'
  | 'Rajabazar'
  | 'Mugda'
  | 'Shankar'
  | 'Others';

export type ICity =
  | 'Dhaka'
  | 'Chittagong (Chattogram)'
  | 'Khulna'
  | 'Rajshahi'
  | 'Sylhet'
  | 'Barisal'
  | 'Rangpur'
  | 'Comilla (Cumilla)'
  | 'Narayanganj'
  | 'Mymensingh'
  | 'Gazipur'
  | 'Jessore (Jashore)'
  | 'Narsingdi'
  | 'Dinajpur'
  | 'Bogra'
  | 'Tangail'
  | 'Faridpur'
  | 'Pabna'
  | "Cox's Bazar"
  | 'Jamalpur'
  | 'Others';

export type ILocation =
  | 'Nilkhet Book Market'
  | 'BanglaBazar Book Market'
  | 'Aziz Super Market'
  | 'Rokomari Book Store'
  | 'Prothoma Prokashon Bookstores'
  | 'Pathak Shamabesh Center'
  | 'Batighar'
  | 'Jonaki Boi Ghar'
  | 'Bookworm'
  | 'Bookshelf'
  | 'Others';

export type IAddress = {
  street: IStreet;
  area: IArea;
  city: ICity;
};

export type IShop = {
  shop_name: string;
  shop_number?: string;
  contact_number: string;
  image?: string;
  location: ILocation;
  address: IAddress;
  shop_weekend?: string;
  shop_open_time?: string;
  shop_close_time?: string;
  book_shop_ratings?: string;
  userEmail?: string;
  description?: string;
};

export type IShopFilter = {
  searchTerm?: string;
  shop_name?: string;
  shop_number?: string;
  contact_number?: string;
  shop_weekend?: string;
  shop_open_time?: string;
  shop_close_time?: string;
  book_shop_ratings?: string;
};

export type ShopModel = Model<IShop, Record<string, unknown>>;
