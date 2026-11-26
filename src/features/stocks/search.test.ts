import { createStockList } from '../../test/fixtures';
import { filterStockOptions, pickKeyword, resolveKeyword, stockPath } from './search';

const { list } = createStockList();

function ids(input: string) {
    return filterStockOptions(list, input).map((option) => option.idString);
}

describe('filterStockOptions', () => {
    it('ranks the exact id first, then ids starting with the text', () => {
        expect(ids('2330')).toEqual(['2330']);
        expect(ids('00')).toEqual(['0056', '00878']);
    });

    it('ranks names starting with the text before names containing it', () => {
        expect(ids('台積')).toEqual(['2330', '3330']);
        expect(ids('高股息')).toEqual(['0056', '00878']);
    });

    it('matches "id name" as shown in the box and ignores case and spaces', () => {
        expect(ids(' 2412 中華電 ')).toEqual(['2412']);
    });

    it('returns the first entries when nothing is typed, up to the limit', () => {
        expect(filterStockOptions(list, '', 2)).toHaveLength(2);
    });

    it('returns nothing when nothing matches', () => {
        expect(ids('不存在')).toEqual([]);
    });
});

describe('resolveKeyword', () => {
    it('takes the id from "id name"', () => {
        expect(resolveKeyword(list, '2330 台積電')).toBe('2330');
    });

    it('turns an exact name into its id', () => {
        expect(resolveKeyword(list, '中華電')).toBe('2412');
    });

    it('matches ids in any case and returns them as the list spells them', () => {
        const options = [...list, { idString: '00631L', name: '元大台灣50正2' }];
        expect(resolveKeyword(options, '00631l')).toBe('00631L');
    });

    it('passes unknown text through for the API to look up', () => {
        expect(resolveKeyword(list, '9999')).toBe('9999');
        expect(resolveKeyword(list, '   ')).toBe('');
    });
});

describe('pickKeyword', () => {
    it('picks the top suggestion, like Enter does', () => {
        expect(pickKeyword(list, '台積')).toBe('2330');
        expect(pickKeyword(list, '高股息')).toBe('0056');
    });

    it('falls back to the typed text when nothing matches', () => {
        expect(pickKeyword(list, '9999')).toBe('9999');
        expect(pickKeyword(list, '  ')).toBe('');
    });
});

describe('stockPath', () => {
    it('builds the stock page path and encodes what would break the route', () => {
        expect(stockPath('2330')).toBe('/stock/2330');
        expect(stockPath('a/b?c')).toBe('/stock/a%2Fb%3Fc');
    });
});
