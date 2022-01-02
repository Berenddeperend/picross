export function getHits(arr: string[]): number[] {
    return arr.reduce((acc:number[], curr, i, arr) => {
        if(curr === 'd') {
            if( acc.length > 0 && arr[i -1] === 'd' ) {
                acc[acc.length -1]++
            } else {
                acc.push(1)
            }
        }
        return acc;
    }, []);
}