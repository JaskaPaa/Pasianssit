

export const rectsIntersection = (r1: DOMRect, r2: DOMRect) => {
    let pos = [[r1.x, r1.y], [r1.right, r1.y], [r1.x, r1.bottom], [r1.right, r1.bottom]];

    for (let i = 0; i < pos.length; i++) {
        let test1 = (pos[i][0] > r2.x && pos[i][0] < r2.right) ? true : false;
        let test2 = (pos[i][1] > r2.y && pos[i][1] < r2.bottom) ? true : false;
        if (test1 && test2)
            return true;
    }

    return false;
}

// Function to apply the Fisher-Yates Shuffle
export const shuffle = (array: any) => {

    // Iterate over the array in reverse order
    for (let i = array.length - 1; i > 0; i--) {

        // Generate Random Index
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
