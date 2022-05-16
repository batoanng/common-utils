import { groupByKeySet } from './group-by-key-set';

const testData = [
    {
        name: 'Name 1',
        skills: ['js', 'java', 'c']
    },
    {
        name: 'Name 2',
        skills: ['js']
    },
    {
        name: 'Name 3',
        skills: ['java', 'c']
    },
    {
        name: 'Name 4',
        skills: ['js', 'c']
    }
];

describe('groupByKeySet', () => {
    it('Group by each element in key set', () => {
        const result = groupByKeySet(testData, (data) => data.skills);
        expect(result).toEqual({
            c: [
                { name: 'Name 1', skills: ['js', 'java', 'c'] },
                { name: 'Name 3', skills: ['java', 'c'] },
                { name: 'Name 4', skills: ['js', 'c'] }
            ],
            java: [
                { name: 'Name 1', skills: ['js', 'java', 'c'] },
                { name: 'Name 3', skills: ['java', 'c'] }
            ],
            js: [
                { name: 'Name 1', skills: ['js', 'java', 'c'] },
                { name: 'Name 2', skills: ['js'] },
                { name: 'Name 4', skills: ['js', 'c'] }
            ]
        });
    });
});
