
export async function loadPatience(name: string) {
    const pat = await import("./" + name + ".js");
    const deal = pat.getDeal();
    const stacks = pat.getStacks();
    return {deal: deal, stacks: stacks};
}