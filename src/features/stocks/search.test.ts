import { createStockList } from '../../test/fixtures';
import { filterStockOptions, resolveKeyword } from './search';

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

    it('passes unknown text through for the API to look up', () => {
        expect(resolveKeyword(list, '9999')).toBe('9999');
        expect(resolveKeyword(list, '   ')).toBe('');
    });
});
