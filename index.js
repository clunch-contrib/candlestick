
/**
 * K线图
*/

var initConfig = function (attr, that) {

    if (attr.width == null) attr.width = that._width;
    if (attr.height == null) attr.height = that._height;
};

export default ['number', 'json', '$ruler', function ($number, $json, $ruler) {
    return {
        attrs: {
            x: $number(0)(true),
            y: $number(0)(true),
            width: $number(null)(true),
            height: $number(null)(true),
            data: $json()
        },
        region: {
            default: function (render, attr) {
                initConfig(attr, this);

                // 一个条目的宽
                var dis = attr.width / (attr.data.length - 1);

                // 开始绘制子区域
                for (var i = 0; i < attr.data.length; i++) {

                    render(i, attr.data[i])
                        .beginPath()
                        .fillRect((i - 0.5) * dis + attr.x, attr.y, dis, attr.height);

                }
            }
        },
        link: function (painter, attr) {
            initConfig(attr, this);

            // 一些辅助变量
            var i, j;

            // 一个条目的宽
            var dis = (attr.width) / (attr.data.length - 1);

            // 先求出最大最小值
            var maxValue = attr.data[0][1];
            var minValue = attr.data[0][1];
            for (i = 0; i < attr.data.length; i++) {
                for (j = 1; j < 5; j++) {
                    if (maxValue < attr.data[i][j]) maxValue = attr.data[i][j];
                    if (minValue > attr.data[i][j]) minValue = attr.data[i][j];
                }
            }

            // 求出刻度尺需要的数据
            var rulerResult = $ruler(maxValue, minValue, 5);

            // 生成数据到坐标映射方法
            var calcPositionYByData = function (data) {
                return attr.height - attr.height * (data - rulerResult.min) / (rulerResult.max - rulerResult.min) + attr.y;
            };

            // 开始绘制
            //     开盘(open)，收盘(close)，最低(lowest)，最高(highest)
            // 信息
            for (i = 0; i < attr.data.length; i++) {

                var valueColor = attr.data[i][1] > attr.data[i][2] ? "#00da3c" : "#ec0000";
                var valueX = i * dis + attr.x;

                painter

                    // 根据实际情况，配置画笔颜色
                    .config({
                        'strokeStyle': valueColor
                    })

                    // 绘制最值
                    .beginPath()
                    .moveTo(valueX, calcPositionYByData(attr.data[i][3]))
                    .lineTo(valueX, calcPositionYByData(attr.data[i][4]))
                    .config('lineWidth', 1)
                    .stroke()

                    // 绘制开始和结束
                    .beginPath()
                    .moveTo(valueX, calcPositionYByData(attr.data[i][1]))
                    .lineTo(valueX, calcPositionYByData(attr.data[i][2]))
                    .config('lineWidth', dis * 0.7)
                    .stroke();
            }

        }
    };
}];
