export function filterByPercentage(items, score, minimum='', maximum='') {
  const min=minimum===''?0:Number(minimum),max=maximum===''?100:Number(maximum);
  return items.filter(item=>score(item)>=min&&score(item)<=max);
}
