export async function post(url, data={}) {
  let result = await fetch(url, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json: charset=utf-8'
    }
  });
  let jsonData = {success: false, message: ''};
  try {
    jsonData = await result.json()
  } catch (e) {
    jsonData.message = e
  }
  return jsonData
}

export async function get(url, data={}) {
  let params = ''
  Object.keys(data).forEach(key => {
    params = params + '&' + key + '=' + data[key]
  })
  if (params) url = url + '?' + params;
  let result = await fetch(url);
  let jsonData = {success: false, message: ''};
  try {
    jsonData = await result.json();
  } catch (e) {
    jsonData.message = e
  }
  return jsonData
}
