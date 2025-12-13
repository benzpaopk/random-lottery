import { useState, useEffect, useRef } from 'react';
import { Sparkles, Moon, Star, Sun, RotateCcw, ShoppingCart, Search, Info, X, Shuffle } from 'lucide-react';

const TOP_2_DIGITS = [
  { number: '98', frequency: 7 },
  { number: '79', frequency: 6 },
  { number: '92', frequency: 6 },
  { number: '85', frequency: 6 },
  { number: '14', frequency: 6 },
  { number: '46', frequency: 6 },
  { number: '53', frequency: 5 },
  { number: '38', frequency: 5 },
  { number: '50', frequency: 5 },
  { number: '65', frequency: 5 },
];

const TOP_3_DIGITS = [
  { number: '576', frequency: 6 },
  { number: '589', frequency: 6 },
  { number: '285', frequency: 4 },
  { number: '375', frequency: 4 },
  { number: '876', frequency: 4 },
  { number: '008', frequency: 4 },
  { number: '074', frequency: 4 },
  { number: '158', frequency: 4 },
  { number: '374', frequency: 4 },
  { number: '648', frequency: 4 },
];

// Emoji name mappings (English and Thai)
const EMOJI_NAMES: Record<string, { en: string; th: string }> = {
  '🙏': { en: 'Folded Hands', th: 'พนมมือ' },
  '🕉️': { en: 'Om', th: 'โอม' },
  '☸️': { en: 'Wheel of Dharma', th: 'ธรรมจักร' },
  '☯️': { en: 'Yin Yang', th: 'หยินหยาง' },
  '🕯️': { en: 'Candle', th: 'เทียน' },
  '📿': { en: 'Prayer Beads', th: 'ลูกประคำ' },
  '🔮': { en: 'Crystal Ball', th: 'ลูกแก้ว' },
  '🧿': { en: 'Nazar', th: 'ตาน้ำ' },
  '⛩️': { en: 'Shinto Shrine', th: 'ศาลเจ้า' },
  '⛪': { en: 'Church', th: 'โบสถ์' },
  '🕌': { en: 'Mosque', th: 'มัสยิด' },
  '🕍': { en: 'Synagogue', th: 'ธรรมศาลา' },
  '🕋': { en: 'Kaaba', th: 'กะอ์บะห์' },
  '🏺': { en: 'Amphora', th: 'แอมโฟรา' },
  '⚱️': { en: 'Funeral Urn', th: 'โกศ' },
  '📜': { en: 'Scroll', th: 'ม้วนกระดาษ' },
  '⚖️': { en: 'Balance Scale', th: 'ตราชู' },
  '🗝️': { en: 'Old Key', th: 'กุญแจเก่า' },
  '🧬': { en: 'DNA', th: 'ดีเอ็นเอ' },
  '🛡️': { en: 'Shield', th: 'โล่' },
  '♈': { en: 'Aries', th: 'ราศีเมษ' },
  '♉': { en: 'Taurus', th: 'ราศีพฤษภ' },
  '♊': { en: 'Gemini', th: 'ราศีเมถุน' },
  '♋': { en: 'Cancer', th: 'ราศีกรกฎ' },
  '♌': { en: 'Leo', th: 'ราศีสิงห์' },
  '♍': { en: 'Virgo', th: 'ราศีกันย์' },
  '♎': { en: 'Libra', th: 'ราศีตุลย์' },
  '♏': { en: 'Scorpio', th: 'ราศีพิจิก' },
  '♐': { en: 'Sagittarius', th: 'ราศีธนู' },
  '♑': { en: 'Capricorn', th: 'ราศีมังกร' },
  '♒': { en: 'Aquarius', th: 'ราศีกุมภ์' },
  '♓': { en: 'Pisces', th: 'ราศีมีน' },
  '🐲': { en: 'Dragon Face', th: 'หน้ามังกร' },
  '🐉': { en: 'Dragon', th: 'มังกร' },
  '🐯': { en: 'Tiger Face', th: 'หน้าเสือ' },
  '🦁': { en: 'Lion', th: 'สิงโต' },
  '🐘': { en: 'Elephant', th: 'ช้าง' },
  '🐢': { en: 'Turtle', th: 'เต่า' },
  '🐍': { en: 'Snake', th: 'งู' },
  '🐎': { en: 'Horse', th: 'ม้า' },
  '🐂': { en: 'Ox', th: 'วัว' },
  '🐃': { en: 'Water Buffalo', th: 'ควาย' },
  '🐓': { en: 'Rooster', th: 'ไก่' },
  '🦅': { en: 'Eagle', th: 'นกอินทรี' },
  '🦉': { en: 'Owl', th: 'นกฮูก' },
  '🦇': { en: 'Bat', th: 'ค้างคาว' },
  '🦋': { en: 'Butterfly', th: 'ผีเสื้อ' },
  '🕷️': { en: 'Spider', th: 'แมงมุม' },
  '🐞': { en: 'Lady Beetle', th: 'เต่าทอง' },
  '🦂': { en: 'Scorpion', th: 'แมงป่อง' },
  '🦀': { en: 'Crab', th: 'ปู' },
  '🐟': { en: 'Fish', th: 'ปลา' },
  '🐬': { en: 'Dolphin', th: 'โลมา' },
  '🐳': { en: 'Whale', th: 'ปลาวาฬ' },
  '🦄': { en: 'Unicorn', th: 'ยูนิคอร์น' },
  '🐸': { en: 'Frog', th: 'กบ' },
  '🐊': { en: 'Crocodile', th: 'จระเข้' },
  '🦢': { en: 'Swan', th: 'หงส์' },
  '🦚': { en: 'Peacock', th: 'นกยูง' },
  '🦜': { en: 'Parrot', th: 'นกแก้ว' },
  '🐁': { en: 'Mouse', th: 'หนู' },
  '🐇': { en: 'Rabbit', th: 'กระต่าย' },
  '💰': { en: 'Money Bag', th: 'ถุงเงิน' },
  '🪙': { en: 'Coin', th: 'เหรียญ' },
  '💎': { en: 'Gem Stone', th: 'เพชร' },
  '👑': { en: 'Crown', th: 'มงกุฎ' },
  '🏆': { en: 'Trophy', th: 'ถ้วยรางวัล' },
  '🥇': { en: '1st Place Medal', th: 'เหรียญทอง' },
  '🧧': { en: 'Red Envelope', th: 'อั่งเปา' },
  '🎲': { en: 'Game Die', th: 'ลูกเต๋า' },
  '🎱': { en: 'Pool 8 Ball', th: 'ลูกบิลเลียด' },
  '💴': { en: 'Yen Banknote', th: 'เงินเยน' },
  '🌙': { en: 'Crescent Moon', th: 'จันทร์เสี้ยว' },
  '☀️': { en: 'Sun', th: 'ดวงอาทิตย์' },
  '⭐': { en: 'Star', th: 'ดาว' },
  '🌟': { en: 'Glowing Star', th: 'ดาวส่องแสง' },
  '🌠': { en: 'Shooting Star', th: 'ดาวตก' },
  '⚡': { en: 'Lightning', th: 'ฟ้าผ่า' },
  '🔥': { en: 'Fire', th: 'ไฟ' },
  '💧': { en: 'Droplet', th: 'หยดน้ำ' },
  '🌊': { en: 'Water Wave', th: 'คลื่น' },
  '🌈': { en: 'Rainbow', th: 'รุ้ง' },
  '☁️': { en: 'Cloud', th: 'เมฆ' },
  '❄️': { en: 'Snowflake', th: 'เกล็ดหิมะ' },
  '🌪️': { en: 'Tornado', th: 'พายุทอร์นาโด' },
  '🍀': { en: 'Four Leaf Clover', th: 'ใบโคลเวอร์สี่แฉก' },
  '🌻': { en: 'Sunflower', th: 'ทานตะวัน' },
  '🌺': { en: 'Hibiscus', th: 'ดอกชบา' },
  '🌹': { en: 'Rose', th: 'กุหลาบ' },
  '🌷': { en: 'Tulip', th: 'ทิวลิป' },
  '🍄': { en: 'Mushroom', th: 'เห็ด' },
  '🎋': { en: 'Tanabata Tree', th: 'ต้นไผ่' },
  '👻': { en: 'Ghost', th: 'ผี' },
  '👽': { en: 'Alien', th: 'มนุษย์ต่างดาว' },
  '🛸': { en: 'Flying Saucer', th: 'ยูเอฟโอ' },
  '🧞': { en: 'Genie', th: 'ยักษ์' },
  '🧚': { en: 'Fairy', th: 'นางฟ้า' },
  '🧜': { en: 'Mermaid', th: 'เงือก' },
  '🧛': { en: 'Vampire', th: 'แวมไพร์' },
  '🧟': { en: 'Zombie', th: 'ซอมบี้' },
  '🧙': { en: 'Mage', th: 'นักเวทย์' },
  '👺': { en: 'Goblin', th: 'ปีศาจ' },
  '✨': { en: 'Sparkles', th: 'ประกาย' },
  '💫': { en: 'Dizzy', th: 'มึน' },
  '🎆': { en: 'Fireworks', th: 'ดอกไม้ไฟ' },
  '🎇': { en: 'Sparkler', th: 'ประทัด' },
  '💥': { en: 'Collision', th: 'ระเบิด' },
  '🔆': { en: 'Bright Button', th: 'สว่าง' },
  '🔅': { en: 'Dim Button', th: 'มืด' },
  '🌤️': { en: 'Sun Behind Small Cloud', th: 'แดดมีเมฆ' },
  '⛅': { en: 'Sun Behind Cloud', th: 'แดดหลังเมฆ' },
  '🌥️': { en: 'Sun Behind Large Cloud', th: 'แดดหลังเมฆใหญ่' },
  '⛈️': { en: 'Cloud With Lightning', th: 'เมฆฟ้าผ่า' },
  '🌩️': { en: 'Cloud With Lightning', th: 'เมฆฟ้าผ่า' },
  '⚠️': { en: 'Warning', th: 'คำเตือน' },
  '☢️': { en: 'Radioactive', th: 'กัมมันตภาพรังสี' },
  '☣️': { en: 'Biohazard', th: 'อันตรายทางชีวภาพ' },
  '🚫': { en: 'Prohibited', th: 'ห้าม' },
  '⛔': { en: 'No Entry', th: 'ห้ามเข้า' },
  '🔞': { en: 'No One Under Eighteen', th: 'ห้ามอายุต่ำกว่า 18' },
  '🎯': { en: 'Direct Hit', th: 'เป้าหมาย' },
  '🎪': { en: 'Circus Tent', th: 'เต็นท์ละครสัตว์' },
  '🎨': { en: 'Artist Palette', th: 'จานสี' },
  '🎭': { en: 'Theater Masks', th: 'หน้ากากละคร' },
  '🎬': { en: 'Clapper Board', th: 'กระดานตบ' },
  '🎤': { en: 'Microphone', th: 'ไมโครโฟน' },
  '🎧': { en: 'Headphone', th: 'หูฟัง' },
  '🎮': { en: 'Video Game', th: 'เกม' },
  '🎳': { en: 'Bowling', th: 'โบว์ลิ่ง' },
  '🎰': { en: 'Slot Machine', th: 'สล็อต' },
  '🧩': { en: 'Puzzle Piece', th: 'จิ๊กซอว์' },
  '♠️': { en: 'Spade Suit', th: 'โพดำ' },
  '♥️': { en: 'Heart Suit', th: 'โพแดง' },
  '♦️': { en: 'Diamond Suit', th: 'ข้าวหลามตัด' },
  '♣️': { en: 'Club Suit', th: 'ดอกจิก' },
  '🀄': { en: 'Mahjong Red Dragon', th: 'ไพ่หงส์' },
  '🎴': { en: 'Flower Playing Cards', th: 'ไพ่ดอกไม้' },
  '🃏': { en: 'Joker', th: 'โจ๊กเกอร์' },
  '🎍': { en: 'Pine Decoration', th: 'ต้นสน' },
  '🎎': { en: 'Japanese Dolls', th: 'ตุ๊กตาญี่ปุ่น' },
  '🎏': { en: 'Carp Streamer', th: 'ธงปลาคาร์ป' },
  '🎐': { en: 'Wind Chime', th: 'กระดิ่งลม' },
  '🎑': { en: 'Moon Viewing Ceremony', th: 'เทศกาลชมจันทร์' },
  '💍': { en: 'Ring', th: 'แหวน' },
  '⌚': { en: 'Watch', th: 'นาฬิกา' },
  '📱': { en: 'Mobile Phone', th: 'โทรศัพท์' },
  '🔔': { en: 'Bell', th: 'กระดิ่ง' },
  '🔕': { en: 'Bell With Slash', th: 'ห้ามเสียง' },
  '🎺': { en: 'Trumpet', th: 'ทรัมเป็ต' },
  '🎸': { en: 'Guitar', th: 'กีตาร์' },
  '🎹': { en: 'Musical Keyboard', th: 'เปียโน' },
  '🥁': { en: 'Drum', th: 'กลอง' },
  '🎷': { en: 'Saxophone', th: 'แซ็กโซโฟน' },
  '🎻': { en: 'Violin', th: 'ไวโอลิน' },
  '🪬': { en: 'Hamsa', th: 'ฮัมซา' },
  '🪶': { en: 'Feather', th: 'ขนนก' },
  '🪤': { en: 'Mouse Trap', th: 'กับดักหนู' },
  '🪒': { en: 'Razor', th: 'มีดโกน' },
  '🪓': { en: 'Axe', th: 'ขวาน' },
  '🪔': { en: 'Diya Lamp', th: 'ตะเกียง' },
  '🪕': { en: 'Banjo', th: 'แบนโจ' },
  '🪖': { en: 'Military Helmet', th: 'หมวกทหาร' },
  '🪗': { en: 'Accordion', th: 'หีบเพลง' },
  '🪘': { en: 'Long Drum', th: 'กลองยาว' },
  '🪚': { en: 'Carpentry Saw', th: 'เลื่อย' },
  '🪛': { en: 'Screwdriver', th: 'ไขควง' },
  '🪜': { en: 'Ladder', th: 'บันได' },
  '🏹': { en: 'Bow and Arrow', th: 'ธนู' },
  '🛠️': { en: 'Hammer and Wrench', th: 'ค้อนและประแจ' },
  '⛏️': { en: 'Pick', th: 'จอบ' },
  '⚒️': { en: 'Hammer and Pick', th: 'ค้อนและจอบ' },
  '🔨': { en: 'Hammer', th: 'ค้อน' },
  '🔧': { en: 'Wrench', th: 'ประแจ' },
  '🔩': { en: 'Nut and Bolt', th: 'น็อตและสลัก' },
  '⚙️': { en: 'Gear', th: 'เฟือง' },
  '🧱': { en: 'Brick', th: 'อิฐ' },
  '⛓️': { en: 'Chains', th: 'โซ่' },
  '🧲': { en: 'Magnet', th: 'แม่เหล็ก' },
  '🔫': { en: 'Water Pistol', th: 'ปืนน้ำ' },
  '💣': { en: 'Bomb', th: 'ระเบิด' },
  '🧨': { en: 'Firecracker', th: 'ประทัด' },
  '🪃': { en: 'Boomerang', th: 'บูมเมอแรง' },
  '🚬': { en: 'Cigarette', th: 'บุหรี่' },
  '⚰️': { en: 'Coffin', th: 'โลงศพ' },
  '💈': { en: 'Barber Pole', th: 'เสาเสริมสวย' },
  '⚗️': { en: 'Alembic', th: 'อุปกรณ์เคมี' },
  '🔭': { en: 'Telescope', th: 'กล้องโทรทรรศน์' },
  '🔬': { en: 'Microscope', th: 'กล้องจุลทรรศน์' },
  '💡': { en: 'Light Bulb', th: 'หลอดไฟ' },
  '🔦': { en: 'Flashlight', th: 'ไฟฉาย' },
  '🏮': { en: 'Red Paper Lantern', th: 'โคมแดง' },
  '📔': { en: 'Notebook With Decorative Cover', th: 'สมุดปกสวย' },
  '📕': { en: 'Closed Book', th: 'หนังสือปิด' },
  '📖': { en: 'Open Book', th: 'หนังสือเปิด' },
  '📗': { en: 'Green Book', th: 'หนังสือเขียว' },
  '📘': { en: 'Blue Book', th: 'หนังสือน้ำเงิน' },
  '📙': { en: 'Orange Book', th: 'หนังสือส้ม' },
  '📚': { en: 'Books', th: 'หนังสือหลายเล่ม' },
  '📓': { en: 'Notebook', th: 'สมุด' },
  '📒': { en: 'Ledger', th: 'สมุดบัญชี' },
  '📑': { en: 'Bookmark Tabs', th: 'ที่คั่นหนังสือ' },
  '🧷': { en: 'Safety Pin', th: 'เข็มกลัด' },
  '🧹': { en: 'Broom', th: 'ไม้กวาด' },
  '🧺': { en: 'Basket', th: 'ตะกร้า' },
  '🧸': { en: 'Teddy Bear', th: 'ตุ๊กตาหมี' },
  '🧵': { en: 'Thread', th: 'ด้าย' },
};

// Helper function to get emoji name
const getEmojiName = (emoji: string): { en: string; th: string } => {
  return EMOJI_NAMES[emoji] || { en: emoji, th: emoji };
};

const EMOJIS = [
  '🙏', '🕉️', '☸️', '☯️', '🕯️', '📿', '🔮', '🧿', '⛩️', '⛪',
  '🕌', '🕍', '🕋', '🏺', '⚱️', '📜', '⚖️', '🗝️', '🧬', '🛡️',
  '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑',
  '♒', '♓', '🐲', '🐉', '🐯', '🦁', '🐘', '🐢', '🐍', '🐎',
  '🐂', '🐃', '🐓', '🦅', '🦉', '🦇', '🦋', '🕷️', '🐞', '🦂',
  '🦀', '🐟', '🐬', '🐳', '🦄', '🐸', '🐊', '🦢', '🦚', '🦜',
  '🐁', '🐇', '💰', '🪙', '💎', '👑', '🏆', '🥇', '🧧', '🎲',
  '🎱', '💴', '🌙', '☀️', '⭐', '🌟', '🌠', '⚡', '🔥', '💧',
  '🌊', '🌈', '☁️', '❄️', '🌪️', '🍀', '🌻', '🌺', '🌹', '🌷',
  '🍄', '🎋', '👻', '👽', '🛸', '🧞', '🧚', '🧜', '🧛', '🧟',
  '🧙', '👺', '✨', '💫', '🎆', '🎇', '💥', '🔆', '🔅', '🌤️',
  '⛅', '🌥️', '⛈️', '🌩️', '⚠️', '☢️', '☣️', '🚫', '⛔', '🔞',
  '🎯', '🎪', '🎨', '🎭', '🎬', '🎤', '🎧', '🎮', '🎳', '🎰',
  '🧩', '♠️', '♥️', '♦️', '♣️', '🀄', '🎴', '🃏', '🎍', '🎎',
  '🎏', '🎐', '🎑', '💍', '⌚', '📱', '🔔', '🔕', '🎺', '🎸',
  '🎹', '🥁', '🎷', '🎻', '🪬', '🪶', '🪤', '🪒', '🪓', '🪔',
  '🪕', '🪖', '🪗', '🪘', '🪚', '🪛', '🪜', '��', '🏹', '🛠️',
  '⛏️', '⚒️', '🔨', '🔧', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫',
  '💣', '🧨', '🪃', '🚬', '⚰️', '💈', '⚗️', '🔭', '🔬', '💡',
  '🔦', '🏮', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓',
  '📒', '📑', '🧷', '🧹', '🧺', '🧸', '🧵', '😋', '😀', '😃',
  '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '🥹', '☺️', '😊',
  '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙',
  '😚', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸',
  '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️',
  '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😮‍💨', '😤', '😠',
  '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥',
  '😓', '🫣', '🤗', '🫡', '🤔', '🫢', '🤭', '🤫', '🤥', '😶',
  '😶‍🌫️', '😐', '😑', '😬', '🫨', '🫠', '🙄', '😯', '😦', '😧',
  '😮', '😲', '🥱', '😴', '🫩', '🤤', '😪', '😵', '😵‍💫', '🫥',
  '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠',
  '😈', '👿', '👹', '🤡', '💩', '💀', '☠️', '👾', '🤖', '🎃',
  '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👋',
  '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰',
  '🤟', '🤘', '🤙', '🫵', '🫱', '🫲', '🫸', '🫷', '🫳', '🫴',
  '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊',
  '🤛', '🤜', '👏', '🫶', '🙌', '👐', '🤲', '🤝', '✍️', '💅',
  '🤳', '💪', '🦾', '🦵', '🦿', '🦶', '👣', '🫆', '👂', '🦻',
  '👃', '🫀', '🫁', '🧠', '🦷', '🦴', '👀', '👁', '👅', '👄',
  '🫦', '💋', '🩸', '👶', '👧', '🧒', '👦', '👩', '🧑', '👨',
  '👱', '👵', '🧓', '👴', '👲', '🧕', '👮', '👷', '💂', '🕵️',
  '👩‍⚕️', '🧑‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🍳', '👩‍🎓', '👩‍🎤', '👨‍🎤', '👩‍🏫', '👨‍🏫',
  '👩‍🏭', '👩‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧', '👩‍🔬', '👨‍🔬', '👩‍🎨',
  '👨‍🎨', '👩‍🚒', '👨‍🚒', '👩‍✈️', '👨‍✈️', '👩‍🚀', '👨‍🚀', '👩‍⚖️', '👨‍⚖️', '👰',
  '🤵', '👸', '🤴', '🥷', '🦸', '🦹', '🤶', '🎅', '🧝', '🧌',
  '👼', '🤰', '🫄', '🫃', '🤱', '🙇', '💁', '🙅', '🙆', '🙋',
  '🧏', '🤦', '🤷', '🙎', '🙍', '💇', '💆', '🧖', '💃', '🕺',
  '👯', '🕴', '👩‍🦽', '🧑‍🦽', '👨‍🦽', '👩‍🦼', '👨‍🦼', '🚶', '🚶‍♂️', '👩‍🦯',
  '🧎', '🏃', '🧍', '👭', '🧑‍🤝‍🧑', '👬', '👫', '👩‍❤️‍👩', '💑', '👨‍❤️‍👨',
  '👩‍❤️‍👨', '👩‍❤️‍💋‍👩', '💏', '👨‍❤️‍💋‍👨', '👩‍❤️‍💋‍👨', '👪', '🗣', '👤', '👥', '🫂',
  '🧳', '🌂', '☂️', '🪡', '🪢', '🪭', '🧶', '👓', '🕶', '🥽',
  '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗',
  '👘', '🥻', '🩴', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜',
  '👝', '🎒', '👞', '👟', '🥾', '🥿', '👠', '👡', '🩰', '👢',
  '👒', '🎩', '🎓', '🧢', '⛑', '💄', '💼', '🐶', '🐱', '🐭',
  '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐮', '🐷', '🐽',
  '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐦‍⬛', '🐤',
  '🐣', '🐥', '🦆', '🐺', '🐗', '🐴', '🐝', '🪱', '🐛', '🐌',
  '🐜', '🪰', '🪲', '🪳', '🦟', '🦗', '🕷', '🕸', '🦎', '🦖',
  '🦕', '🐙', '🦑', '🦐', '🦞', '🪼', '🪸', '🐡', '🐠', '🐋',
  '🦈', '🐅', '🐆', '🦓', '🫏', '🦍', '🦧', '🦣', '🦛', '🦏',
  '🐪', '🐫', '🦒', '🦘', '🦬', '🐄', '🐖', '🐏', '🐑', '🦙',
  '🐐', '🦌', '🫎', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🪽',
  '🦃', '🦤', '🪿', '🦩', '🕊', '🦝', '🦨', '🦡', '🦫', '🦦',
  '🦥', '🐀', '🐿', '🦔', '🐾', '🐦‍🔥', '🌵', '🎄', '🌲', '🌳',
  '🪾', '🌴', '🪹', '🪺', '🪵', '🌱', '🌿', '☘️', '🪴', '🍃',
  '🍂', '🍁', '🍄‍🟫', '🐚', '🪨', '🌾', '💐', '🪷', '🥀', '🌸',
  '🪻', '🌼', '🌞', '🌝', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗',
  '🌘', '🌑', '🌒', '🌓', '🌔', '🌎', '🌍', '🌏', '🪐', '⭐️',
  '⚡️', '☄️', '🌪', '🌤', '⛅️', '🌥', '🌦', '🌧', '⛈', '🌩',
  '🌨', '☃️', '⛄️', '🌬', '💨', '💦', '🫧', '☔️', '🍏', '🍎',
  '🍐', '🍊', '🍋', '🍋‍🟩', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈',
  '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦', '🫛',
  '🥬', '🫜', '🥒', '🌶', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅',
  '🫚', '🥔', '🍠', '🫘', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀',
  '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🌭',
  '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔',
  '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱',
  '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢',
  '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭',
  '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼',
  '🫖', '☕️', '🍵', '🧃', '🥤', '🧋', '🫙', '🍶', '🍺', '🍻',
  '🥂', '🍷', '🫗', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄',
  '🍴', '🍽', '🥣', '🥡', '🥢', '🧂', '⚽️', '🏀', '🏈', '⚾️',
  '🥎', '🎾', '🏐', '🏉', '🥏', '🪀', '🏓', '🏸', '🏒', '🏑',
  '🥍', '🏏', '🥅', '⛳️', '🪁', '🎣', '🤿', '🥊', '🥋', '🎽',
  '🛹', '🛼', '🛷', '⛸', '🥌', '🎿', '⛷', '🏂', '🪂', '🏋️',
  '🤼', '🤸', '⛹️', '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊',
  '🤽', '🚣', '🧗', '🚵', '🚴', '🥈', '🥉', '🏅', '🎖', '🏵',
  '🎗', '🎫', '🎟', '🤹', '🎼', '🪇', '🪈', '♟', '🚗', '🚕',
  '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚',
  '🚛', '🚜', '🦯', '🦽', '🦼', '🛴', '🚲', '🛵', '🏍', '🛺',
  '🚨', '🚔', '🚍', '🚘', '🚖', '🛞', '🚡', '🚠', '🚟', '🚃',
  '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊',
  '🚉', '✈️', '🛫', '🛬', '🛩', '💺', '🛰', '🚀', '🚁', '🛶',
  '⛵️', '🚤', '🛥', '🛳', '⛴', '🚢', '⚓️', '🛟', '🪝', '⛽️',
  '🚧', '🚦', '🚥', '🚏', '🗺', '🗿', '🗽', '🗼', '🏰', '🏯',
  '🏟', '🎡', '🎢', '🛝', '🎠', '⛲️', '⛱', '🏖', '🏝', '🏜',
  '🌋', '⛰', '🏔', '🗻', '🏕', '⛺️', '🛖', '🏠', '🏡', '🏘',
  '🏚', '🏗', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨',
  '🏪', '🏫', '🏩', '💒', '🏛', '⛪️', '🛕', '⛩', '🛤', '🛣',
  '🗾', '🏞', '🌅', '🌄', '🌇', '🌆', '🏙', '🌃', '🌌', '🌉',
  '🌁', '⌚️', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹',
  '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥',
  '📽', '🎞', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙', '🎚',
  '🎛', '🧭', '⏱', '⏲', '⏰', '🕰', '⌛️', '⏳', '📡', '🔋',
  '🪫', '🔌', '🕯', '🧯', '🛢', '🛍️', '💸', '💵', '💶', '💷',
  '💳', '🪮', '🧰', '⚒', '🛠', '⛏', '⛓', '🕳', '🩹', '🩺',
  '🩻', '🩼', '💊', '💉', '🦠', '🧫', '🧪', '🌡', '🪠', '🧻',
  '🚽', '🚰', '🚿', '🛁', '🛀', '🧼', '🪥', '🧽', '🪣', '🧴',
  '🛎', '🔑', '🗝', '🚪', '🪑', '🛋', '🛏', '🛌', '🪆', '🖼',
  '🪞', '🪟', '🛍', '🛒', '🎁', '🎈', '🎀', '🪄', '🪅', '🎊',
  '🎉', '🪩', '✉️', '📩', '📨', '📧', '💌', '📥', '📤', '📦',
  '🏷', '🪧', '📪', '📫', '📬', '📭', '📮', '📯', '📃', '📄',
  '🧾', '📊', '📈', '📉', '🗒', '🗓', '📆', '📅', '🗑', '🪪',
  '📇', '🗃', '🗳', '🗄', '📋', '📁', '📂', '🗂', '🗞', '📰',
  '🔖', '🔗', '📎', '🖇', '📐', '📏', '🧮', '📌', '📍', '✂️',
  '🖊', '🖋', '✒️', '🖌', '🖍', '📝', '✏️', '🔍', '🔎', '🔏',
  '🔐', '🔒', '🔓', '❤️', '🩷', '🧡', '💛', '💚', '💙', '🩵',
  '💜', '🖤', '🩶', '🤍', '🤎', '❤️‍🔥', '❤️‍🩹', '💔', '❣️', '💕',
  '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️',
  '🪯', '🕉', '✡️', '🔯', '🕎', '☦️', '🛐', '⛎', '♈️', '♉️',
  '♊️', '♋️', '♌️', '♍️', '♎️', '♏️', '♐️', '♑️', '♒️', '♓️',
  '🆔', '⚛️', '🉑', '📴', '📳', '🈶', '🈚️', '🈸', '🈺', '🈷️',
  '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲',
  '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕️', '🛑', '⛔️',
  '📛', '💯', '🫟', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '📵',
  '🚭', '❗️', '❕', '❓', '❔', '‼️', '⁉️', '〽️', '🚸', '🔱',
  '⚜️', '🔰', '♻️', '✅', '🈯️', '💹', '❇️', '✳️', '❎', '🌐',
  '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿️', '🅿️', '🛗', '🈳',
  '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '⚧', '🚻',
  '🚮', '🎦', '🛜', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠',
  '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣',
  '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣',
  '⏏️', '▶️', '⏸', '⏯', '⏹', '⏺', '⏭', '⏮', '⏩', '⏪',
  '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️',
  '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀',
  '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️',
  '🟰', '♾', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿',
  '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠',
  '🟡', '🟢', '🔵', '🟣', '⚫️', '⚪️', '🟤', '🔺', '🔻', '🔸',
  '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾️', '◽️', '◼️',
  '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛️', '⬜️', '🟫',
  '🔈', '🔇', '🔉', '🔊', '📣', '📢', '👁‍🗨', '💬', '💭', '🗯',
  '🀄️', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘',
  '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢',
  '🕣', '🕤', '🕥', '🕦', '🕧', '🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈',
  '🏳️‍⚧️', '🏴‍☠️', '🇦🇫', '🇦🇽', '🇦🇱', '🇩🇿', '🇦🇸', '🇦🇩', '🇦🇴', '🇦🇮',
  '🇦🇶', '🇦🇬', '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺', '🇦🇹', '🇦🇿', '🇧🇸', '🇧🇭',
  '🇧🇩', '🇧🇧', '🇧🇾', '🇧🇪', '🇧🇿', '🇧🇯', '🇧🇲', '🇧🇹', '🇧🇴', '🇧🇦',
  '🇧🇼', '🇧🇷', '🇮🇴', '🇻🇬', '🇧🇳', '🇧🇬', '🇧🇫', '🇧🇮', '🇰🇭', '🇨🇲',
  '🇨🇦', '🇮🇨', '🇨🇻', '🇧🇶', '🇰🇾', '🇨🇫', '🇹🇩', '🇨🇱', '🇨🇳', '🇨🇽',
  '🇨🇨', '🇨🇴', '🇨🇵', '🇰🇲', '🇨🇬', '🇨🇩', '🇨🇰', '🇨🇶', '🇨🇷', '🇨🇮',
  '🇭🇷', '🇨🇺', '🇨🇼', '🇨🇾', '🇨🇿', '🇩🇰', '🇩🇯', '🇩🇲', '🇩🇴', '🇪🇨',
  '🇪🇬', '🇸🇻', '🇬🇶', '🇪🇷', '🇪🇪', '🇪🇹', '🇪🇺', '🇫🇰', '🇫🇴', '🇫🇯',
  '🇫🇮', '🇫🇷', '🇬🇫', '🇵🇫', '🇹🇫', '🇬🇦', '🇬🇲', '🇬🇪', '🇩🇪', '🇬🇭',
  '🇬🇮', '🇬🇷', '🇬🇱', '🇬🇩', '🇬🇵', '🇬🇺', '🇬🇹', '🇬🇬', '🇬🇳', '🇬🇼',
  '🇬🇾', '🇭🇹', '🇭🇳', '🇭🇰', '🇭🇺', '🇮🇸', '🇮🇳', '🇮🇩', '🇮🇷', '🇮🇶',
  '🇮🇪', '🇮🇲', '🇮🇱', '🇮🇹', '🇯🇲', '🇯🇵', '🎌', '🇯🇪', '🇯🇴', '🇰🇿',
  '🇰🇪', '🇰🇮', '🇽🇰', '🇰🇼', '🇰🇬', '🇱🇦', '🇱🇻', '🇱🇧', '🇱🇸', '🇱🇷',
  '🇱🇾', '🇱🇮', '🇱🇹', '🇱🇺', '🇲🇴', '🇲🇰', '🇲🇬', '🇲🇼', '🇲🇾', '🇲🇻',
  '🇲🇱', '🇲🇹', '🇲🇭', '🇲🇶', '🇲🇷', '🇲🇺', '🇾🇹', '🇲🇽', '🇫🇲', '🇲🇩',
  '🇲🇨', '🇲🇳', '🇲🇪', '🇲🇸', '🇲🇦', '🇲🇿', '🇲🇲', '🇳🇦', '🇳🇷', '🇳🇵',
  '🇳🇱', '🇳🇨', '🇳🇿', '🇳🇮', '🇳🇪', '🇳🇬', '🇳🇺', '🇳🇫', '🇰🇵', '🇲🇵',
  '🇳🇴', '🇴🇲', '🇵🇰', '🇵🇼', '🇵🇸', '🇵🇦', '🇵🇬', '🇵🇾', '🇵🇪', '🇵🇭',
  '🇵🇳', '🇵🇱', '🇵🇹', '🇵🇷', '🇶🇦', '🇷🇪', '🇷🇴', '🇷🇺', '🇷🇼', '🇼🇸',
  '🇸🇲', '🇸🇦', '🇸🇳', '🇷🇸', '🇸🇨', '🇸🇱', '🇸🇬', '🇸🇽', '🇸🇰', '🇸🇮',
  '🇬🇸', '🇸🇧', '🇸🇴', '🇿🇦', '🇰🇷', '🇸🇸', '🇪🇸', '🇱🇰', '🇧🇱', '🇸🇭',
  '🇰🇳', '🇱🇨', '🇵🇲', '🇻🇨', '🇸🇩', '🇸🇷', '🇸🇿', '🇸🇪', '🇨🇭', '🇸🇾',
  '🇹🇼', '🇹🇯', '🇹🇿', '🇹🇭', '🇹🇱', '🇹🇬', '🇹🇰', '🇹🇴', '🇹🇹', '🇹🇳',
  '🇹🇷', '🇹🇲', '🇹🇨', '🇹🇻', '🇻🇮', '🇺🇬', '🇺🇦', '🇦🇪', '🇬🇧', '🇺🇸',
  '🇺🇾', '🇺🇿', '🇻🇺', '🇻🇦', '🇻🇪', '🇻🇳', '🇼🇫', '🇪🇭', '🇾🇪', '🇿🇲',
  '🇿🇼'
];


function App() {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<string[]>(['?', '?', '?']);
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const [showBuyButton, setShowBuyButton] = useState(false);
  const [emojiFilter, setEmojiFilter] = useState('');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateDate = "1 ธันวาคม 2568";

  const generateLuckyNumber = () => {
    const num = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return num.split('');
  };

  const handleEmojiSelect = (emoji: string) => {
    if (isPredicting || showBuyButton) return;
    if (selectedEmojis.length < 3) {
      setSelectedEmojis([...selectedEmojis, emoji]);
    }
  };

  const handleRemoveEmoji = (index: number) => {
    if (isPredicting || showBuyButton) return;
    const newEmojis = [...selectedEmojis];
    newEmojis.splice(index, 1);
    setSelectedEmojis(newEmojis);
  };

  const startPrediction = () => {
    if (selectedEmojis.length !== 3 || isPredicting) return;

    setIsPredicting(true);
    setRevealedIndex(-1);
    setShowBuyButton(false);
    const finalNumber = generateLuckyNumber();

    let shuffleCount = 0;
    intervalRef.current = setInterval(() => {
      setPredictionResult([
        Math.floor(Math.random() * 10).toString(),
        Math.floor(Math.random() * 10).toString(),
        Math.floor(Math.random() * 10).toString()
      ]);
      shuffleCount++;
    }, 50);

    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      startRevealSequence(finalNumber);
    }, 2000);
  };

  const startRevealSequence = (finalNum: string[]) => {
    setPredictionResult([finalNum[0], '?', '?']);
    setRevealedIndex(0);

    setTimeout(() => {
      setPredictionResult([finalNum[0], finalNum[1], '?']);
      setRevealedIndex(1);
    }, 1500);

    setTimeout(() => {
      setPredictionResult(finalNum);
      setRevealedIndex(2);
      setIsPredicting(false);
      setShowBuyButton(true);
    }, 3000);
  };

  const reset = () => {
    setSelectedEmojis([]);
    setPredictionResult(['?', '?', '?']);
    setRevealedIndex(-1);
    setShowBuyButton(false);
    setIsPredicting(false);
    setEmojiFilter('');
  };

  const randomizeEmojis = () => {
    if (isPredicting || showBuyButton) return;
    
    // Get available emojis (use filtered emojis if filter is active, otherwise use all)
    const availableEmojis = emojiFilter.trim() ? filteredEmojis : EMOJIS;
    
    if (availableEmojis.length < 3) {
      // If filtered results have less than 3 emojis, use all emojis
      const shuffled = [...EMOJIS].sort(() => Math.random() - 0.5);
      setSelectedEmojis(shuffled.slice(0, 3));
    } else {
      // Randomly select 3 unique emojis from available
      const shuffled = [...availableEmojis].sort(() => Math.random() - 0.5);
      setSelectedEmojis(shuffled.slice(0, 3));
    }
  };

  // Filter emojis based on search query
  const filteredEmojis = EMOJIS.filter(emoji => {
    if (!emojiFilter.trim()) return true;
    const query = emojiFilter.toLowerCase();
    const names = getEmojiName(emoji);
    return (
      names.en.toLowerCase().includes(query) ||
      names.th.includes(query) ||
      emoji.includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[20%] w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_10px_2px_white] animate-pulse"></div>
        <div className="absolute top-[60%] left-[10%] w-[3px] h-[3px] bg-yellow-200 rounded-full shadow-[0_0_15px_2px_yellow] animate-pulse delay-700"></div>
        <div className="absolute inset-0 opacity-20"
             style={{backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px'}}>
        </div>
      </div>

      <header className="bg-slate-900/80 backdrop-blur-md border-b border-indigo-500/30 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-indigo-900/50 border border-indigo-400/30 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <Moon className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 tracking-wide">
                ดวงดาวเสี่ยงโชค
              </h1>
              <p className="text-indigo-400 text-xs">Sacred Lottery Insight</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-indigo-950/50 px-4 py-2 rounded-full border border-indigo-500/30">
            <Info className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-medium text-indigo-200">
              อัพเดตล่าสุด งวดวันที่ {updateDate}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-8 relative z-10">

        <section className="bg-gradient-to-b from-indigo-900/60 to-slate-900/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-indigo-500/30 relative min-h-[600px]">

           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

           <div className="p-6 md:p-8 text-center relative z-10 flex flex-col items-center">
             <div className="mb-4 inline-flex items-center gap-2 px-4 py-1 rounded-full border border-yellow-500/30 bg-yellow-900/10 text-yellow-200 text-sm">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-spin-slow" />
                <span>เสี่ยงทายจากสิ่งศักดิ์สิทธิ์</span>
             </div>

             <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 to-yellow-600 mb-2 drop-shadow-sm">
               ตั้งจิตอธิษฐาน เลือก 3 สัญลักษณ์
             </h2>
             <p className="text-indigo-300 mb-8 font-light">
               เลือกสัญลักษณ์มงคลที่เป็นตัวแทนความเชื่อของคุณ
             </p>

             <div className="flex gap-4 sm:gap-6 mb-8">
               {[0, 1, 2].map((idx) => (
                 <div
                    key={idx}
                    onClick={() => selectedEmojis[idx] && !isPredicting ? handleRemoveEmoji(idx) : null}
                    className={`
                      w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all relative overflow-hidden group
                      ${selectedEmojis[idx]
                        ? 'bg-indigo-900/80 border-yellow-500 cursor-pointer shadow-[0_0_25px_rgba(234,179,8,0.3)]'
                        : 'bg-slate-800/50 border-indigo-500/30 border-dashed'}
                      ${isPredicting && selectedEmojis[idx] ? 'animate-pulse' : ''}
                    `}
                 >
                   {selectedEmojis[idx] && (
                     <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-purple-500/10 pointer-events-none"></div>
                   )}

                   <span className="relative z-10 drop-shadow-lg filter">
                    {selectedEmojis[idx] || <span className="text-indigo-500/30 text-2xl">{idx + 1}</span>}
                   </span>

                   {selectedEmojis[idx] && !isPredicting && !showBuyButton && (
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                       <span className="text-xs text-white">เปลี่ยน</span>
                     </div>
                   )}
                 </div>
               ))}
             </div>

             {!isPredicting && !showBuyButton && (
                <div className="w-full max-w-2xl animate-in fade-in duration-500">
                  <div className="flex items-center justify-between mb-3 px-2">
                    <div className="text-sm text-indigo-300/70">
                      เลือกสัญลักษณ์: <span className="font-bold text-yellow-400">{selectedEmojis.length}/3</span>
                    </div>
                  </div>
                  
                  {/* Randomizer Button */}
                  <div className="mb-4 flex justify-center">
                    <button
                      onClick={randomizeEmojis}
                      disabled={isPredicting || showBuyButton || (emojiFilter.trim() && filteredEmojis.length < 3)}
                      className={`
                        flex items-center gap-2 px-6 py-3 rounded-full border transition-all
                        ${isPredicting || showBuyButton || (emojiFilter.trim() && filteredEmojis.length < 3)
                          ? 'bg-slate-700/30 border-indigo-500/20 text-indigo-400/50 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400/30 text-white hover:from-purple-500 hover:to-indigo-500 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]'
                        }
                      `}
                    >
                      <Shuffle className="w-5 h-5" />
                      <span className="font-medium">สุ่มเลือก 3 สัญลักษณ์</span>
                    </button>
                  </div>

                  {/* Search Filter */}
                  <div className="relative mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" />
                      <input
                        type="text"
                        value={emojiFilter}
                        onChange={(e) => setEmojiFilter(e.target.value)}
                        placeholder="ค้นหาโดยชื่อภาษาอังกฤษหรือไทย... / Search by English or Thai name..."
                        className="w-full pl-10 pr-10 py-3 bg-slate-800/60 border border-indigo-500/30 rounded-xl text-indigo-200 placeholder-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                      />
                      {emojiFilter && (
                        <button
                          onClick={() => setEmojiFilter('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    {emojiFilter && (
                      <div className="mt-2 text-xs text-indigo-400/70 px-2">
                        พบ {filteredEmojis.length} สัญลักษณ์ / Found {filteredEmojis.length} emojis
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 max-h-72 overflow-y-auto p-4 custom-scrollbar bg-slate-900/50 rounded-xl border border-indigo-500/30 shadow-inner">
                    {filteredEmojis.length > 0 ? (
                      filteredEmojis.map((emoji, idx) => {
                        const names = getEmojiName(emoji);
                        return (
                          <button
                            key={`${emoji}-${idx}`}
                            onClick={() => handleEmojiSelect(emoji)}
                            disabled={selectedEmojis.length >= 3}
                            title={`${names.en} / ${names.th}`}
                            className={`
                              text-2xl p-2 rounded-lg transition-all border border-transparent relative group
                              ${selectedEmojis.length >= 3
                                ? 'opacity-20 cursor-not-allowed grayscale'
                                : 'hover:bg-indigo-600/30 hover:scale-125 hover:shadow-[0_0_10px_rgba(99,102,241,0.5)] cursor-pointer hover:border-indigo-400/50'}
                            `}
                          >
                            {emoji}
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-xs text-indigo-200 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-indigo-500/30">
                              <div className="font-medium">{names.en}</div>
                              <div className="text-indigo-400">{names.th}</div>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="col-span-full text-center py-8 text-indigo-400/70">
                        <p>ไม่พบสัญลักษณ์ที่ค้นหา</p>
                        <p className="text-sm mt-1">No emojis found</p>
                      </div>
                    )}
                  </div>
                </div>
             )}

             {(isPredicting || showBuyButton || selectedEmojis.length === 3) && (
               <div className={`
                 transition-all duration-700 flex flex-col items-center w-full
                 ${!isPredicting && !showBuyButton && selectedEmojis.length === 3 ? 'mt-4' : 'mt-0'}
               `}>

                 <div className="flex gap-4 sm:gap-8 mb-8 mt-6">
                   {[0, 1, 2].map((idx) => (
                     <DigitBox
                       key={idx}
                       value={predictionResult[idx]}
                       isRevealed={idx <= revealedIndex}
                       isAnimating={isPredicting && idx > revealedIndex}
                       hasPlaceholder={!isPredicting && !showBuyButton && selectedEmojis.length === 3}
                     />
                   ))}
                 </div>

                 <div className="h-24 flex items-center justify-center w-full">
                    {!isPredicting && !showBuyButton && selectedEmojis.length === 3 && (
                      <button
                        onClick={startPrediction}
                        className="relative group bg-gradient-to-r from-yellow-600 to-amber-700 text-white text-lg font-bold py-3 px-16 rounded-full shadow-[0_0_20px_rgba(217,119,6,0.4)] overflow-hidden transition-all hover:scale-105 active:scale-95"
                      >
                        <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 -skew-x-12"></div>
                        <span className="relative flex items-center gap-2 tracking-wider">
                          <Search className="w-5 h-5" />
                          เสี่ยงทายตัวเลข
                        </span>
                      </button>
                    )}

                    {isPredicting && (
                      <div className="text-yellow-400 tracking-widest flex items-center gap-3 animate-pulse">
                        <Moon className="w-5 h-5 animate-spin-slow" />
                        <span>ดวงดาวกำลังเคลื่อนย้าย...</span>
                        <Star className="w-5 h-5 animate-spin-slow delay-150" />
                      </div>
                    )}

                    {showBuyButton && (
                      <div className="flex flex-col gap-4 animate-in slide-in-from-bottom duration-700 items-center">
                        <button
                          className="bg-gradient-to-r from-emerald-600 to-green-700 text-white text-xl font-bold py-4 px-16 rounded-full shadow-[0_0_25px_rgba(5,150,105,0.5)] hover:shadow-green-400/30 hover:-translate-y-1 transition-all flex items-center gap-3 border border-green-400/30"
                          onClick={() => alert(`คุณเลือกจะซื้อเลข ${predictionResult.join('')} ขอให้โชคดี!`)}
                        >
                          <ShoppingCart className="w-6 h-6" />
                          ซื้อเลขนำโชค {predictionResult.join('')}
                        </button>
                        <button
                          onClick={reset}
                          className="text-indigo-300 text-sm hover:text-white underline flex items-center justify-center gap-1 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" /> ทำนายใหม่อีกครั้ง
                        </button>
                      </div>
                    )}
                 </div>
               </div>
             )}
           </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-indigo-500/20 shadow-xl overflow-hidden">
            <div className="bg-slate-800/60 p-4 border-b border-indigo-500/20 flex items-center justify-between">
              <h2 className="font-bold text-indigo-200 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                สถิติเลขท้าย 2 ตัว (10 ปี)
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {TOP_2_DIGITS.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 group">
                  <div className="w-8 text-center text-indigo-400/50">#{idx + 1}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-lg text-yellow-100 group-hover:text-yellow-400 transition-colors shadow-black drop-shadow-md">{item.number}</span>
                      <span className="text-xs text-indigo-300/70">{item.frequency} ครั้ง</span>
                    </div>
                    <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                        style={{ width: `${(item.frequency / 7) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-indigo-500/20 shadow-xl overflow-hidden">
            <div className="bg-slate-800/60 p-4 border-b border-indigo-500/20 flex items-center justify-between">
              <h2 className="font-bold text-indigo-200 flex items-center gap-2">
                <Sun className="w-5 h-5 text-orange-400" />
                สถิติเลขท้าย 3 ตัว (10 ปี)
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {TOP_3_DIGITS.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 group">
                  <div className="w-8 text-center text-indigo-400/50">#{idx + 1}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-lg text-yellow-100 group-hover:text-yellow-400 transition-colors shadow-black drop-shadow-md">{item.number}</span>
                      <span className="text-xs text-indigo-300/70">{item.frequency} ครั้ง</span>
                    </div>
                    <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                        style={{ width: `${(item.frequency / 6) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="text-center text-indigo-400/40 text-sm py-4">
          <p>ข้อมูลสถิตินี้รวบรวมเพื่อความบันเทิงและเป็นความเชื่อส่วนบุคคล</p>
          <p className="text-xs mt-1 opacity-70">โปรดใช้วิจารณญาณในการรับชม</p>
        </footer>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(129, 140, 248, 0.7);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}

const DigitBox = ({ value, isRevealed, isAnimating, hasPlaceholder }: { value: string, isRevealed: boolean, isAnimating: boolean, hasPlaceholder: boolean }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 10).toString());
      }, 50);
    } else {
      setDisplayValue(value);
    }
    return () => clearInterval(interval);
  }, [isAnimating, value]);

  return (
    <div className={`
      relative w-20 h-28 sm:w-28 sm:h-40
      rounded-xl flex items-center justify-center text-6xl sm:text-7xl font-bold
      transition-all duration-500 border
      ${isRevealed
        ? 'bg-gradient-to-b from-indigo-900 to-black text-yellow-400 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.4)] scale-110 z-10'
        : 'bg-slate-800/50 border-indigo-500/30 text-indigo-500/50 scale-100'}
      ${isAnimating ? 'animate-pulse border-indigo-400 bg-indigo-900/40 text-indigo-200' : ''}
    `}>
      <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-current opacity-50"></div>
      <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-current opacity-50"></div>
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-current opacity-50"></div>
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-current opacity-50"></div>

      <span className={`relative z-10 drop-shadow-2xl ${isAnimating ? 'blur-[1px]' : ''}`}>
        {hasPlaceholder && !isAnimating && !isRevealed ? '?' : displayValue}
      </span>
    </div>
  );
};

export default App;
