const expect = require('expect');
const {isRealString} = require('./validation');

describe('Srting validation', () => {
    it('should reject non-string values', () => {
        var str = 999;
        var res = isRealString(str);
        expect(res).toBeFalsy();
    });

    it('should reject string with only spaces', () => {
        var str = "     ";
        var res = isRealString(str);
        expect(res).toBeFalsy();
    });

    it('should allow string with non-spaces characters', () => {
        var str = " allow me  ";
        var res = isRealString(str);
        expect(res).toBeTruthy();
    });
});