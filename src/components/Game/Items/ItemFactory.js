import Manji from "./Manji";
import YagyuRyuYayuji from "./YagyuRyuYayuji";
import KoboriRyuHorenGata from "./KoboriRyuHorenGata";
import IgaRyuHappo from "./IgaRyuHappo";
import GurandoMasutaa from "./GurandoMasutaa";
import Key from "./Key";

export default function generateItem(name) {
    switch (name) {
        case 'Manji': return new Manji();
        case 'Yagyu Ryu Yayuji': return new YagyuRyuYayuji();
        case 'Kobori Ryu Horen Gata': return new KoboriRyuHorenGata();
        case 'Iga Ryu Happo': return new IgaRyuHappo();
        case 'Gurando Masutaa': return new GurandoMasutaa();
        case 'Key': return new Key();
    }
}
