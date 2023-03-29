const { Observable, Subject, from } = require('rxjs')
const { base64decode, base64encode } = require('nodejs-base64')
const { mergeMap, mergeAll, filter } = require('rxjs/operators')

const controllerObservableCollection = []
const connectSubject$ = new Subject()

const onConnect = (ws) => {
  connectSubject$.next(ws)
}

const messageObservable$ = connectSubject$.pipe(
  mergeMap(
    (ws) =>
      new Observable((subscriber) => {
        ws.on('message', (data) =>
          subscriber.next({
            message: JSON.parse(base64decode(Buffer.from(data).toString())),
          }),
        )
      }),
  ),
)

const createController = (controller) => {
  controllerObservableCollection.push(controller(messageObservable$))
}

const ofType = (messageType) => {
  return (observable$) =>
    observable$.pipe(
      filter(({ message: { eventType } } = {}) => eventType === messageType),
    )
}

const subscribeToResponse = (controllerObservableCollection) => {
  return from(controllerObservableCollection)
    .pipe(mergeAll())
    .subscribe(({ ws, response }) => {
      ws.send(base64encode(JSON.stringify(response)))
    })
}

const websocketController = (websocketServer) => {
  subscribeToResponse(controllerObservableCollection)
  websocketServer.on('connection', onConnect)
}

module.exports = {
  onConnect,
  createController,
  ofType,
  websocketController,
}
