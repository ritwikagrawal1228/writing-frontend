export const roundSentence = (str: string, limit: number): string => {
  let modStr = str //カット後の文字列を入れる変数

  if (modStr === null || !modStr) return ''

  if (modStr.length > limit) {
    modStr = `${str.substr(0, limit)}...`
  }

  return modStr
}
