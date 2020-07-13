const runtimeArgs = {}

export async function getRuntimeArgs () {
  const args = await fetch('/runtime-args.json').then(res => res.json())
  Object.assign(runtimeArgs, args)
  return args
}

export default runtimeArgs
